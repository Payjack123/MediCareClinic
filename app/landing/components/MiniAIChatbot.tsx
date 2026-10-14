'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Bot, X, Send, Sparkles, RotateCcw, Maximize2, 
  User, Stethoscope, ChevronDown, Check, Copy, AlertCircle
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  source?: string;
  isLiveAI?: boolean;
  timestamp: string;
}

const QUICK_PROMPTS = [
  '🩺 Phân tích triệu chứng',
  '💊 Hỏi về cách dùng thuốc',
  '🫀 Dấu hiệu đau tức ngực',
  '📅 Hướng dẫn đặt lịch khám'
];

export default function MiniAIChatbot() {
  const pathname = usePathname();
  
  // Không hiển thị mini chatbot nếu người dùng đang ở trang Tra cứu AI toàn màn hình
  if (pathname === '/landing/tra-cuu') {
    return null;
  }

  return <MiniAIChatbotInner />;
}

function MiniAIChatbotInner() {
  const [isOpen, setIsOpen] = useState(false);
  const [showBadge, setShowBadge] = useState(true);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Xin chào! Tôi là **Bác sĩ Trợ lý AI MediCare** 🩺.\n\nTôi có thể giải đáp nhanh triệu chứng bất thường, tư vấn dùng thuốc an toàn, hoặc gợi ý chuyên khoa và gói khám phù hợp.\n\nBạn đang cần tư vấn vấn đề sức khỏe nào?`,
      timestamp: 'Vừa xong'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Cuộn xuống tin nhắn mới nhất trong khung chat mini
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, isOpen]);

  // Focus ô nhập khi mở khung chat
  useEffect(() => {
    if (isOpen) {
      setShowBadge(false);
      setTimeout(() => textareaRef.current?.focus(), 150);
    }
  }, [isOpen]);

  const handleSend = async (textToSend?: string) => {
    const content = (textToSend || input).trim();
    if (!content || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content }))
        })
      });

      if (!res.ok) throw new Error('Lỗi máy chủ');

      const data = await res.json();
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.reply || 'Xin lỗi, tôi chưa hiểu rõ câu hỏi. Bạn vui lòng thử lại nhé.',
        source: data.source,
        isLiveAI: data.isLiveAI,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMsg]);
    } catch {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '⚠️ Có lỗi kết nối. Vui lòng kiểm tra lại mạng hoặc gọi hotline 0941.298.865 để được hỗ trợ gấp.',
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleReset = () => {
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: `Cuộc trò chuyện đã được làm mới! Bác sĩ AI MediCare sẵn sàng hỗ trợ bạn.`,
        timestamp: 'Vừa xong'
      }
    ]);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      
      {/* 1. KHUNG CHAT MINI (HIỂN THỊ KHI ISOPEN = TRUE) */}
      {isOpen && (
        <div className="w-[370px] sm:w-[400px] max-w-[calc(100vw-32px)] h-[550px] max-h-[calc(100vh-100px)] bg-white rounded-3xl shadow-2xl border border-gray-200/90 overflow-hidden flex flex-col mb-3 transition-all duration-300 animate-in fade-in slide-in-from-bottom-5">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white px-4 py-3.5 flex items-center justify-between border-b border-slate-800 shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-2xl flex items-center justify-center shadow-md shadow-blue-500/30">
                  <Bot size={22} className="text-white" />
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full animate-pulse"></span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm text-white">Bác Sĩ AI MediCare</h4>
                  <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-emerald-400/30 flex items-center gap-1">
                    <Sparkles size={10} className="text-yellow-400 animate-pulse" />
                    AI Live
                  </span>
                </div>
                <p className="text-[11px] text-gray-400">Tư vấn triệu chứng & giải đáp y khoa 24/7</p>
              </div>
            </div>

            {/* Các nút trên header */}
            <div className="flex items-center gap-1">
              <button
                onClick={handleReset}
                className="p-1.5 text-gray-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
                title="Làm mới trò chuyện"
              >
                <RotateCcw size={15} />
              </button>
              
              <Link
                href="/landing/tra-cuu"
                className="p-1.5 text-gray-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
                title="Mở toàn màn hình"
              >
                <Maximize2 size={15} />
              </Link>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-gray-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
                title="Thu nhỏ"
              >
                <X size={17} />
              </button>
            </div>
          </div>

          {/* Body tin nhắn */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/70 text-xs sm:text-sm">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 max-w-[88%] ${
                  msg.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
                }`}
              >
                {/* Avatar nhỏ */}
                <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gradient-to-tr from-slate-900 to-indigo-900 text-blue-400 border border-slate-700'
                }`}>
                  {msg.role === 'user' ? <User size={14} /> : <Stethoscope size={14} />}
                </div>

                {/* Bong bóng tin nhắn */}
                <div className="flex flex-col group max-w-[calc(100%-36px)]">
                  <div
                    className={`p-3 rounded-2xl leading-relaxed whitespace-pre-wrap relative shadow-xs ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-tr-none'
                        : 'bg-white text-gray-800 border border-gray-200/80 rounded-tl-none'
                    }`}
                  >
                    {msg.content}

                    {msg.role === 'assistant' && (
                      <button
                        onClick={() => handleCopy(msg.content, msg.id)}
                        className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 p-1 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition"
                        title="Sao chép"
                      >
                        {copiedId === msg.id ? <Check size={12} className="text-green-600" /> : <Copy size={12} />}
                      </button>
                    )}
                  </div>

                  <div className={`flex items-center gap-1.5 mt-0.5 px-1 text-[10px] text-gray-400 ${
                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}>
                    <span>{msg.timestamp}</span>
                    {msg.role === 'assistant' && msg.source && (
                      <span className="text-blue-500 font-medium">
                        • {msg.isLiveAI ? 'Google Gemini' : 'MediCare'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Đang suy nghĩ */}
            {isLoading && (
              <div className="flex gap-2 max-w-[85%] mr-auto items-center">
                <div className="w-7 h-7 rounded-xl bg-slate-900 text-blue-400 flex items-center justify-center shrink-0 border border-slate-700">
                  <Bot size={14} className="animate-spin" />
                </div>
                <div className="bg-white border border-gray-200/80 rounded-2xl rounded-tl-none p-3 shadow-xs flex items-center gap-2 text-xs text-gray-500">
                  <span className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce"></span>
                  </span>
                  <span>Bác sĩ AI đang phân tích...</span>
                </div>
              </div>
            )}

            {/* Gợi ý câu hỏi nhanh khi bắt đầu */}
            {messages.length === 1 && !isLoading && (
              <div className="pt-2">
                <p className="text-[11px] font-semibold text-gray-400 mb-2 px-1">Gợi ý câu hỏi nhanh:</p>
                <div className="flex flex-col gap-1.5">
                  {QUICK_PROMPTS.map((prompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(prompt.replace(/^[^\s]+\s/, ''))}
                      className="text-left text-xs bg-white hover:bg-blue-50/80 hover:text-blue-700 text-gray-700 border border-gray-200/80 hover:border-blue-200 px-3 py-2 rounded-xl transition shadow-2xs font-medium"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input */}
          <div className="p-3 bg-white border-t border-gray-100 shrink-0">
            <div className="flex items-center gap-2 bg-gray-50 rounded-2xl border border-gray-200 px-3 py-1.5 focus-within:border-blue-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100 transition">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Nhập triệu chứng, câu hỏi..."
                rows={1}
                className="w-full bg-transparent resize-none text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:outline-hidden py-1 max-h-20"
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || isLoading}
                className="w-8 h-8 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-center shrink-0 disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-md transition"
              >
                <Send size={14} />
              </button>
            </div>
            <div className="flex items-center justify-between mt-2 text-[10px] text-gray-400 px-1">
              <span>Hỗ trợ y khoa tham khảo</span>
              <Link href="/landing/tra-cuu" className="text-blue-600 font-semibold hover:underline">
                Xem toàn màn hình →
              </Link>
            </div>
          </div>

        </div>
      )}

      {/* 2. NÚT TRÒN NỔI TRIGGER (KÈM TOOLTIP GỢI Ý KHI THU GỌN) */}
      <div className="flex items-center gap-2">
        {/* Bong bóng thông báo khi chưa mở */}
        {!isOpen && showBadge && (
          <div className="bg-white text-gray-800 py-2 px-3.5 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-2 animate-fade-in hover:shadow-2xl transition group relative cursor-pointer"
               onClick={() => setIsOpen(true)}>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-gray-900 flex items-center gap-1">
                Tư vấn Bác sĩ AI
                <Sparkles size={12} className="text-amber-500" />
              </span>
              <span className="text-[10px] text-gray-500">Trực tuyến 24/7 • Hỏi ngay</span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowBadge(false);
              }}
              className="text-gray-400 hover:text-gray-600 ml-1 p-0.5 rounded-full hover:bg-gray-100"
              title="Đóng thông báo"
            >
              <X size={12} />
            </button>
          </div>
        )}

        {/* Nút bấm tròn chính */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 relative group ${
            isOpen
              ? 'bg-slate-800 text-white hover:bg-slate-900 scale-95'
              : 'bg-gradient-to-tr from-blue-600 via-indigo-600 to-blue-700 text-white hover:scale-105 shadow-blue-500/40 ring-4 ring-blue-500/20'
          }`}
          title={isOpen ? 'Đóng chat' : 'Hỏi Bác sĩ AI'}
        >
          {isOpen ? (
            <ChevronDown size={26} className="transition-transform group-hover:translate-y-0.5" />
          ) : (
            <>
              <Bot size={26} className="transition-transform group-hover:scale-110" />
              <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></span>
            </>
          )}
        </button>
      </div>

    </div>
  );
}
