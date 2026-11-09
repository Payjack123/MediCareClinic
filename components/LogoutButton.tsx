'use client';

import React, { useState } from 'react';
import { LogOut, Loader2 } from 'lucide-react';
import { performLogout } from '@/lib/auth-client';

interface LogoutButtonProps {
  redirectTo?: string;
  className?: string;
  variant?: 'outline' | 'ghost' | 'solid' | 'text';
  children?: React.ReactNode;
  showIcon?: boolean;
}

export default function LogoutButton({
  redirectTo = '/login',
  className = '',
  variant = 'outline',
  children,
  showIcon = true
}: LogoutButtonProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogoutClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    await performLogout(redirectTo);
  };

  const baseStyles = "inline-flex items-center gap-1.5 transition-all text-xs font-bold cursor-pointer disabled:opacity-60";

  let variantStyles = "px-3 py-1.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300";
  if (variant === 'ghost') {
    variantStyles = "text-gray-500 hover:text-red-600 px-2 py-1";
  } else if (variant === 'solid') {
    variantStyles = "px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 shadow-sm";
  } else if (variant === 'text') {
    variantStyles = "text-red-600 hover:underline p-0";
  }

  return (
    <button
      type="button"
      onClick={handleLogoutClick}
      disabled={isLoggingOut}
      className={`${baseStyles} ${variantStyles} ${className}`}
      title="Đăng xuất khỏi hệ thống"
    >
      {isLoggingOut ? (
        <Loader2 size={14} className="animate-spin" />
      ) : (
        showIcon && <LogOut size={14} />
      )}
      <span>{children || (isLoggingOut ? 'Đang thoát...' : 'Đăng xuất')}</span>
    </button>
  );
}
