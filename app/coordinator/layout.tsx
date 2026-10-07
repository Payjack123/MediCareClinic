import React from 'react';
import CoordinatorLayout from './sidebar';

export const metadata = {
  title: 'MediCare - Điều phối viên',
  description: 'Hệ thống quản lý phòng khám - Dành cho Điều phối viên',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <CoordinatorLayout>
      {children}
    </CoordinatorLayout>
  );
}
