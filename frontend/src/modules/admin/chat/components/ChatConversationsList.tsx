import React from "react";
import { Search } from "lucide-react";
import type { Conversation } from "../types/chat.type";
import { getInitials, getAvatarBg } from "../utils/chatUtils";

interface ChatConversationsListProps {
  search: string;
  onSearchChange: (val: string) => void;
  filteredConversations: Conversation[];
  selectedConversationId: string;
  onSelectConversation: (id: string) => void;
  isMobileDetailActive: boolean;
  setIsMobileDetailActive: (val: boolean) => void;
}

const ChatConversationsList: React.FC<ChatConversationsListProps> = ({
  search,
  onSearchChange,
  filteredConversations,
  selectedConversationId,
  onSelectConversation,
  isMobileDetailActive,
  setIsMobileDetailActive,
}) => {
  return (
    <div className={`border-r border-slate-100 flex flex-col h-full ${
      isMobileDetailActive ? "hidden lg:flex" : "flex"
    }`}>
      {/* List Header Search */}
      <div className="p-4 border-b border-slate-50">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm hội thoại hoặc tin nhắn..."
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-9 pr-3.5 py-2 text-sm placeholder-slate-400 outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
          />
        </div>
      </div>

      {/* Conversations scroll wrapper */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {filteredConversations.length === 0 ? (
          <p className="text-slate-400 text-xs text-center py-6 font-medium">Không tìm thấy hội thoại</p>
        ) : (
          filteredConversations.map((item) => {
            const lastMessage = item.messages[item.messages.length - 1];
            const isActive = selectedConversationId === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectConversation(item.id);
                  setIsMobileDetailActive(true); // Switch pane on mobile
                }}
                className={`w-full rounded-xl p-3 text-left transition-all duration-200 flex gap-3 cursor-pointer ${
                  isActive
                    ? "bg-indigo-50/70 border-l-4 border-l-indigo-600"
                    : "hover:bg-slate-50 border-l-4 border-l-transparent"
                }`}
              >
                <div className={`h-11 w-11 rounded-xl border flex-none flex items-center justify-center font-bold text-sm shadow-sm relative ${getAvatarBg(item.customer)}`}>
                  {getInitials(item.customer)}
                  {item.status === "online" && (
                    <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 border-2 border-white animate-pulse" />
                  )}
                </div>

                <div className="flex-1 min-w-0 space-y-0.5">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-slate-900 text-sm truncate">{item.customer}</p>
                    <span className="text-[10px] text-slate-400 font-medium shrink-0">{lastMessage?.time ?? ""}</span>
                  </div>
                  <p className="line-clamp-1 text-xs text-slate-500 font-medium pr-2">
                    {lastMessage?.from === "admin" ? "Bạn: " : ""}{lastMessage?.content ?? ""}
                  </p>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ChatConversationsList;
