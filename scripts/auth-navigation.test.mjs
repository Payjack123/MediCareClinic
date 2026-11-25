import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const requireDependency = createRequire(import.meta.url);
const projectDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function loadModule(relativePath, dependencies = {}) {
  const filename = path.join(projectDirectory, relativePath);
  const source = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
    fileName: filename,
  }).outputText;
  const compiledModule = { exports: {} };
  const execute = vm.runInThisContext(`(function(require, module, exports) { ${source}\n})`, { filename });
  execute(name => Object.hasOwn(dependencies, name) ? dependencies[name] : requireDependency(name), compiledModule, compiledModule.exports);
  return compiledModule.exports;
}

const navigation = loadModule('lib/auth-navigation.ts');

function findForm(element) {
  if (!element || typeof element !== 'object') return null;
  if (element.type === 'form') return element;
  const children = element.props?.children;
  for (const child of Array.isArray(children) ? children : [children]) {
    const found = findForm(child);
    if (found) return found;
  }
  return null;
}

async function submitLogin(query, result) {
  const destinations = [];
  const react = requireDependency('react');
  const login = loadModule('app/(auth)/login/page.tsx', {
    react: { ...react, useState: initial => [typeof initial === 'function' ? initial() : initial, () => {}] },
    'next/navigation': {
      useRouter: () => ({ replace: destination => destinations.push(destination), push: destination => destinations.push(destination) }),
      useSearchParams: () => new URLSearchParams(query),
    },
    '@/app/(auth)/actions/auth': { loginUser: async () => result },
    '@/lib/auth-navigation': navigation,
  });
  const loginFormElement = login.default().props.children;
  const form = findForm(loginFormElement.type(loginFormElement.props));
  assert.ok(form, 'The actual login form must be rendered.');
  await form.props.onSubmit({ preventDefault() {} });
  return destinations;
}

for (const redirect of ['', '/landing', '/landing/dat-lich', '/patient/appointments']) {
  test(`password login opens the patient dashboard with legacy redirect ${redirect || '(none)'}`, async () => {
    const query = new URLSearchParams(redirect ? { redirect } : {}).toString();
    assert.deepEqual(await submitLogin(query, { success: true, role: 'patient' }), ['/patient/dashboard']);
  });
}

for (const role of ['doctor', 'admin', 'receptionist']) {
  test(`password login still opens the ${role} dashboard`, async () => {
    assert.deepEqual(await submitLogin('redirect=/landing', { success: true, role }), [`/${role}/dashboard`]);
  });
}

test('failed password authentication does not open a dashboard', async () => {
  assert.deepEqual(await submitLogin('redirect=/landing', { success: false, message: 'Invalid credentials' }), []);
});

async function googleCallback(role, query) {
  const previousFetch = globalThis.fetch;
  const environmentNames = ['GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET', 'NEXT_PUBLIC_APP_URL'];
  const previousEnvironment = Object.fromEntries(environmentNames.map(name => [name, process.env[name]]));
  const cookieWrites = [];
  process.env.GOOGLE_CLIENT_ID = 'test-client';
  process.env.GOOGLE_CLIENT_SECRET = 'test-secret';
  process.env.NEXT_PUBLIC_APP_URL = 'https://clinic.example.test';
  globalThis.fetch = async input => {
    if (input === 'https://oauth2.googleapis.com/token') return Response.json({ access_token: 'test-token' });
    if (input === 'https://www.googleapis.com/oauth2/v3/userinfo') return Response.json({ email: 'patient@example.test', name: 'Test user' });
    throw new Error('Unexpected external request in authentication test.');
  };
  try {
    const callback = loadModule('app/api/auth/google/callback/route.ts', {
      'next/server': { NextResponse: { redirect: destination => Response.redirect(destination, 307) } },
      'next/headers': { cookies: async () => ({ set: (...args) => cookieWrites.push(args) }) },
      '@/lib/prisma': { user: { findUnique: async () => ({ id: 123, role, fullName: 'Test user', avatar: 'test-avatar' }) } },
      '@/lib/auth-navigation': navigation,
    });
    const response = await callback.GET({
      nextUrl: new URL(`https://clinic.example.test/api/auth/google/callback?${query}`),
      headers: new Headers({ host: 'clinic.example.test' }),
    });
    return { response, cookieWrites };
  } finally {
    globalThis.fetch = previousFetch;
    for (const name of environmentNames) {
      if (previousEnvironment[name] === undefined) delete process.env[name];
      else process.env[name] = previousEnvironment[name];
    }
  }
}

for (const role of ['PATIENT', 'DOCTOR', 'ADMIN', 'RECEPTIONIST']) {
  test(`Google callback opens the ${role.toLowerCase()} dashboard despite an old landing state`, async () => {
    const { response, cookieWrites } = await googleCallback(role, 'code=test-code&state=%2Flanding');
    assert.equal(response.headers.get('location'), `https://clinic.example.test/${role.toLowerCase()}/dashboard`);
    assert.equal(cookieWrites.find(([name]) => name === 'user_role')[1], role.toLowerCase());
    assert.equal(cookieWrites.find(([name]) => name === 'user_id')[1], '123');
  });
}

test('Google callback from an old booking link opens the patient dashboard', async () => {
  const { response } = await googleCallback('PATIENT', 'code=test-code&state=%2Flanding%2Fdat-lich');
  assert.equal(response.headers.get('location'), 'https://clinic.example.test/patient/dashboard');
});

test('cancelled Google authentication returns to login without creating a session', async () => {
  const { response, cookieWrites } = await googleCallback('PATIENT', 'error=access_denied&state=%2Flanding');
  assert.equal(response.headers.get('location'), 'https://clinic.example.test/login?error=GoogleAuthFailed');
  assert.equal(cookieWrites.length, 0);
});
