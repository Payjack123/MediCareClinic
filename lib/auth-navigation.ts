export function getDashboardPath(role?: string | null): string {
  switch (role?.toUpperCase()) {
    case 'DOCTOR':
      return '/doctor/dashboard';
    case 'ADMIN':
      return '/admin/dashboard';
    case 'RECEPTIONIST':
      return '/receptionist/dashboard';
    default:
      return '/patient/dashboard';
  }
}
