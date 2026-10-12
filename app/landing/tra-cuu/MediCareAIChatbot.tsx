'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { 
  Send, Bot, User, Sparkles, RotateCcw, 
  ExternalLink, Check, Copy, AlertCircle, Info,
  Stethoscope, HelpCircle, ShieldCheck, ChevronRight
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  source?: string;
  isLiveAI?: boolean;
  timestamp: string;
}

const DEFAULT_PROMPTS = [
  {
    icon: '🩺',
    title: 'Phân tích triệu chứng',
    prompt: 'Tôi bị đau nửa đầu bên phải nhói theo nhịp và buồn nôn 2 ngày nay, tôi nên làm gì?'
  },
  {
    icon: '💊',
    title: 'Hỏi về thuốc',
    prompt: 'Thuốc hạ sốt Paracetamol nên uống cách nhau mấy tiếng và liều tối đa là bao nhiêu?'
  },
  {
    icon: '🫀',
    title: 'Cảnh báo tim mạch',
    prompt: 'Dấu hiệu nào cho thấy cơn đau ngực có nguy cơ nhồi máu cơ tim cần cấp cứu ngay?'
  },
  {
    icon: '📦',
    title: 'Tư vấn gói khám',
    prompt: 'MediCare có những gói khám sức khỏe tổng quát nào cho nam và nữ?'
  }
];

export default function MediCareAIChatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Xin chào! Tôi là **Bác sĩ Trợ lý AI của Hệ thống Y tế MediCare** 🩺.\n\nTôi được trang bị trí tuệ nhân tạo y khoa để giải đáp mọi thắc mắc của bạn: từ phân tích triệu chứng bất thường, hướng dẫn dùng thuốc an toàn, giải thích chỉ số xét nghiệm, đến tư vấn chuyên khoa và gói khám phù hợp.\n\nBạn có thể gõ bất kỳ câu hỏi hoặc yêu cầu nào bên dưới, tôi sẽ giải đáp chi tiết ngay!`,
      timestamp: 'Vừa xong'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Tự động cuộn xuống tin nhắn mới nhất trong khung chat (không làm cuộn trang web)
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isLoading]);

  // Gửi tin nhắn
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

      if (!res.ok) {
        throw new Error('Lỗi máy chủ');
      }

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
    } catch (err) {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '⚠️ Có lỗi kết nối khi xử lý câu trả lời. Vui lòng kiểm tra lại kết nối mạng hoặc thử lại sau giây lát.',
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

  const handleResetChat = () => {
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: `Cuộc trò chuyện đã được làm mới! Bác sĩ AI MediCare đã sẵn sàng, hãy cho tôi biết bạn đang cần tư vấn vấn đề sức khỏe nào nhé.`,
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
    <div className="w-full bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col h-[750px] relative">
      
      {/* 1. CHAT HEADER */}
      <div className="bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white px-6 py-4 flex items-center justify-between border-b border-slate-800 z-10">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-11 h-11 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Bot size={24} className="text-white" />
            </div>
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-slate-900 rounded-full animate-pulse"></span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base sm:text-lg text-white">Bác Sĩ Trợ Lý AI MediCare</h3>
              <span className="bg-emerald-500/20 text-emerald-300 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border border-emerald-400/30 flex items-center gap-1">
                <Sparkles size={11} className="text-yellow-400 animate-pulse" />
                Gemini 3.8 AI Live
              </span>
            </div>
            <p className="text-xs text-gray-400">Trực tuyến 24/7 • Tư vấn y khoa & giải đáp mọi câu hỏi</p>
          </div>
        </div>

        {/* Nút hành động */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleResetChat}
            className="px-3 py-1.5 text-gray-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-xl transition flex items-center gap-1.5 text-xs font-semibold border border-slate-700"
            title="Làm mới cuộc trò chuyện"
          >
            <RotateCcw size={14} />
            <span>Làm mới</span>
          </button>
        </div>
      </div>

      {/* 2. CHAT MESSAGES STREAM */}
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-[#f8fafc]/80">
        
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 max-w-[90%] sm:max-w-[82%] ${
              msg.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
            }`}
          >
            {/* Avatar */}
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
              msg.role === 'user'
                ? 'bg-blue-600 text-white'
                : 'bg-gradient-to-tr from-slate-900 to-indigo-900 text-blue-400 border border-slate-700'
            }`}>
              {msg.role === 'user' ? <User size={18} /> : <Stethoscope size={18} />}
            </div>

            {/* Bubble */}
            <div className="flex flex-col group">
              <div
                className={`p-4 sm:p-5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap relative shadow-sm ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-tr-none'
                    : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                }`}
              >
                {/* Nội dung tin nhắn */}
                {msg.content}

                {/* Nút copy cho câu trả lời của AI */}
                {msg.role === 'assistant' && (
                  <button
                    onClick={() => handleCopy(msg.content, msg.id)}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition"
                    title="Sao chép câu trả lời"
                  >
                    {copiedId === msg.id ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
                  </button>
                )}
              </div>

              {/* Timestamp & info tag */}
              <div className={`flex items-center gap-2 mt-1 px-1 text-[11px] text-gray-400 ${
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              }`}>
                <span>{msg.timestamp}</span>
                {msg.role === 'assistant' && msg.source && (
                  <span className="text-blue-500 font-medium">
                    • {msg.isLiveAI ? 'Google Gemini' : 'MediCare Engine'}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex gap-3 max-w-[80%] mr-auto items-center">
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-blue-400 flex items-center justify-center shrink-0 border border-slate-700">
              <Bot size={18} className="animate-spin" />
            </div>
            <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-none p-4 shadow-sm flex items-center gap-3">
              <div className="flex gap-1.5">
                <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></span>
              </div>
              <span className="text-xs text-gray-500 font-medium">Bác sĩ AI đang suy nghĩ và soạn câu trả lời...</span>
            </div>
          </div>
        )}

        {/* Gợi ý câu hỏi nhanh (Chỉ hiện khi chưa có nhiều tin nhắn) */}
        {messages.length === 1 && !isLoading && (
          <div className="pt-2">
            <p className="text-xs font-semibold text-gray-500 mb-3 flex items-center gap-1.5 uppercase tracking-wider">
              <HelpCircle size={14} className="text-blue-600" />
              Gợi ý câu hỏi bạn có thể thử ngay:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {DEFAULT_PROMPTS.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(item.prompt)}
                  className="bg-white hover:bg-blue-50/60 border border-gray-200 hover:border-blue-300 p-3 rounded-2xl text-left transition-all group flex items-start gap-2.5 shadow-xs"
                >
                  <span className="text-lg shrink-0 mt-0.5">{item.icon}</span>
                  <div>
                    <h5 className="font-bold text-gray-900 text-xs group-hover:text-blue-700 transition">
                      {item.title}
                    </h5>
                    <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{item.prompt}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* End of message stream */}
      </div>

      {/* 3. INPUT BAR */}
      <div className="p-4 bg-white border-t border-gray-200">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-2xl p-1.5 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all shadow-inner"
        >
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            placeholder="Hỏi bất cứ điều gì (VD: Đau đầu kéo dài 3 ngày, nên uống thuốc gì hoặc khám khoa nào?)..."
            className="flex-1 bg-transparent px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400 outline-none resize-none max-h-32"
          />

          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="w-10 h-10 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-xl flex items-center justify-center transition-all shadow-md shadow-blue-500/20 disabled:shadow-none shrink-0"
            title="Gửi câu hỏi (Enter)"
          >
            <Send size={18} />
          </button>
        </form>

        <div className="flex items-center justify-between text-[11px] text-gray-400 mt-2 px-1">
          <span>Nhấn <kbd className="font-mono bg-gray-100 px-1 py-0.5 rounded text-gray-600">Enter</kbd> để gửi, <kbd className="font-mono bg-gray-100 px-1 py-0.5 rounded text-gray-600">Shift + Enter</kbd> để xuống dòng</span>
          <span className="text-gray-400 italic">Thông tin AI chỉ mang tính tham khảo y khoa</span>
        </div>
      </div>

    </div>
  );
}
