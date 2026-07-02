import React from "react";
import { ChevronLeft, Phone, Video, Info, Send } from "lucide-react";
import type { Conversation } from "../types/chat.type";
import { getInitials, getAvatarBg } from "../utils/chatUtils";

interface ChatViewportProps {
  selectedConversation: Conversation | null;
  draftMessage: string;
  onDraftMessageChange: (val: string) => void;
  onSend: () => void;
  isMobileDetailActive: boolean;
  setIsMobileDetailActive: (val: boolean) => void;
}

const ChatViewport: React.FC<ChatViewportProps> = ({
  selectedConversation,
  draftMessage,
  onDraftMessageChange,
  onSend,
  isMobileDetailActive,
  setIsMobileDetailActive,
}) => {
  return (
    <div className={`lg:col-span-2 flex flex-col h-full bg-slate-50/20 ${
      isMobileDetailActive ? "flex" : "hidden lg:flex"
    }`}>
      {selectedConversation ? (
        <>
          {/* Chat View Header */}
          <div className="p-4 border-b border-slate-100 bg-white flex items-center justify-between flex-none shadow-xs">
            <div className="flex items-center gap-3">
              {/* Back button on mobile */}
              <button 
                onClick={() => setIsMobileDetailActive(false)}
                className="lg:hidden rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 active:scale-95 transition cursor-pointer"
              >
                <ChevronLeft size={20} />
              </button>

              <div className={`h-10 w-10 rounded-xl border flex flex-none items-center justify-center font-bold text-sm shadow-sm relative ${getAvatarBg(selectedConversation.customer)}`}>
                {getInitials(selectedConversation.customer)}
                {selectedConversation.status === "online" && (
                  <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 border border-white" />
                )}
              </div>
              
              <div>
                <h2 className="font-bold text-slate-900 text-sm leading-snug">{selectedConversation.customer}</h2>
                <div className="flex items-center gap-1">
                  {selectedConversation.status === "online" ? (
                    <>
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Trực tuyến</span>
                    </>
                  ) : (
                    <>
                      <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{selectedConversation.activeText}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Dummy action icons */}
            <div className="flex items-center gap-1.5 text-slate-400">
              <button className="p-2 rounded-lg hover:bg-slate-50 hover:text-indigo-600 transition cursor-pointer" title="Gọi thoại"><Phone size={17} /></button>
              <button className="p-2 rounded-lg hover:bg-slate-50 hover:text-indigo-600 transition cursor-pointer" title="Gọi video"><Video size={17} /></button>
              <button className="p-2 rounded-lg hover:bg-slate-50 hover:text-indigo-600 transition cursor-pointer" title="Thông tin khách hàng"><Info size={17} /></button>
            </div>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/40">
            {selectedConversation.messages.map((message) => {
              const isAdmin = message.from === "admin";
              return (
                <div
                  key={message.id}
                  className={`flex gap-2 max-w-[85%] sm:max-w-[75%] ${isAdmin ? "ml-auto flex-row-reverse" : ""}`}
                >
                  {!isAdmin && (
                    <div className={`h-8 w-8 rounded-lg border flex flex-none items-center justify-center font-bold text-xs shadow-inner shrink-0 self-end ${getAvatarBg(selectedConversation.customer)}`}>
                      {getInitials(selectedConversation.customer)}
                    </div>
                  )}
                  
                  <div className="space-y-1">
                    <div
                      className={`rounded-2xl p-3 text-sm leading-relaxed shadow-xs ${
                        isAdmin
                          ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-br-none shadow-indigo-600/5"
                          : "bg-white text-slate-800 rounded-bl-none border border-slate-100"
                      }`}
                    >
                      <p>{message.content}</p>
                    </div>
                    <p className={`text-[9px] font-semibold tracking-wide uppercase ${
                      isAdmin ? "text-right text-indigo-400" : "text-slate-400"
                    }`}>
                      {message.time}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Message Input Composer */}
          <div className="p-4 border-t border-slate-100 bg-white flex-none">
            <div className="flex gap-2">
              <input
                type="text"
                value={draftMessage}
                onChange={(event) => onDraftMessageChange(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    onSend();
                  }
                }}
                placeholder={`Gửi phản hồi nhanh cho ${selectedConversation.customer}...`}
                className="flex-1 rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm placeholder-slate-400 outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
              />
              <button
                type="button"
                onClick={onSend}
                className="rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 text-sm font-semibold text-white shadow-md shadow-indigo-600/10 hover:shadow-lg hover:from-indigo-500 hover:to-violet-500 transition-all transform active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Send size={15} />
                <span className="hidden sm:inline">Gửi đi</span>
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8 space-y-2.5">
          <span className="text-4xl filter drop-shadow">💬</span>
          <p className="text-sm font-bold">Hãy chọn một cuộc hội thoại</p>
          <p className="text-xs text-slate-400 text-center max-w-[280px]">Vui lòng lựa chọn tài khoản khách hàng từ danh sách bên trái để phản hồi.</p>
        </div>
      )}
    </div>
  );
};

export default ChatViewport;
