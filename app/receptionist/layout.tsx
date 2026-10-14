import React from 'react';
import ReceptionistLayout from './Sidebar';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'MediCare - Lễ tân',
  description: 'Hệ thống quản lý phòng khám - Dành cho Lễ tân',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ReceptionistLayout>
      {children}
    </ReceptionistLayout>
  );
}
