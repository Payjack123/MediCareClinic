'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Bell, Check, Info, AlertTriangle, AlertCircle, X } from 'lucide-react';
import { getMyNotifications, markNotificationAsRead } from '@/app/actions/notifications';

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    fetchNotifications();

    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    setIsLoading(true);
    const res = await getMyNotifications();
    if (res.success) {
      setNotifications(res.data);
    }
    setIsLoading(false);
  };

  const handleMarkAsRead = async (id: number) => {
    const res = await markNotificationAsRead(id);
    if (res.success) {
      setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'WARNING': return <AlertTriangle size={18} className="text-orange-500" />;
      case 'DANGER': return <AlertCircle size={18} className="text-red-500" />;
      case 'SUCCESS': return <Check size={18} className="text-green-500" />;
      default: return <Info size={18} className="text-blue-500" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 bg-gray-50 border border-gray-200 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 rounded-full text-gray-600 transition-all focus:outline-none focus:ring-2 focus:ring-blue-100"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 -mt-1 -mr-1 flex items-center justify-center w-5 h-5 bg-red-500 text-white text-[10px] font-black rounded-full border-2 border-white animate-bounce shadow-sm">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden origin-top-right animate-in fade-in zoom-in duration-200">
          <div className="bg-gray-50 border-b border-gray-100 px-4 py-3 flex items-center justify-between">
            <h3 className="font-bold text-gray-800">Thông báo</h3>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600 p-1"
            >
              <X size={16} />
            </button>
          </div>

          <div className="max-h-[400px] overflow-y-auto">
            {isLoading ? (
              <div className="p-8 text-center text-gray-400 text-sm">Đang tải...</div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500 text-sm flex flex-col items-center gap-2">
                <Bell size={32} className="text-gray-200" />
                <p>Bạn không có thông báo nào mới.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {notifications.map(notif => (
                  <div 
                    key={notif.id} 
                    className={`p-4 hover:bg-gray-50 transition flex gap-3 cursor-pointer ${notif.isRead ? 'opacity-70' : 'bg-blue-50/30'}`}
                    onClick={() => !notif.isRead && handleMarkAsRead(notif.id)}
                  >
                    <div className="mt-0.5 flex-shrink-0">
                      {getIcon(notif.type)}
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm ${notif.isRead ? 'text-gray-600' : 'text-gray-900 font-bold'}`}>
                        {notif.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                        {notif.message}
                      </p>
                      <p className="text-[10px] text-gray-400 mt-2">
                        {new Date(notif.createdAt).toLocaleString('vi-VN')}
                      </p>
                    </div>
                    {!notif.isRead && (
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-1 flex-shrink-0"></div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="border-t border-gray-100 p-2 bg-gray-50 text-center">
            <button className="text-xs font-bold text-[#2563EB] hover:text-blue-800">
              Đánh dấu đã đọc tất cả
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
