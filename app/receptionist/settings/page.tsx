import React from 'react';
import SettingsClient from './SettingsClient';
import { getReceptionistSettings } from './actions';

export const metadata = {
  title: 'Cài Đặt Cá Nhân - Lễ Tân | MediCare',
  description: 'Quản lý thông tin cá nhân, cấu hình quầy tiếp đón và bảo mật tài khoản lễ tân',
};

export default async function ReceptionistSettingsPage() {
  const result = await getReceptionistSettings();
  const initialUser = result.success ? result.data?.user : null;
  const initialPreferences = result.success ? result.data?.preferences : null;

  return (
    <SettingsClient 
      initialUser={initialUser} 
      initialPreferences={initialPreferences} 
    />
  );
}
