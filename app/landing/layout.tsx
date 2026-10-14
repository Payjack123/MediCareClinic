import React from 'react';
import MiniAIChatbot from './components/MiniAIChatbot';

export const dynamic = 'force-dynamic';

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <MiniAIChatbot />
    </>
  );
}
