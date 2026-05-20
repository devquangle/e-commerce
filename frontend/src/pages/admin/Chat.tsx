import { useMemo, useState } from "react";
import { 
  MessageSquare, 
  Search, 
  Send, 
  ChevronLeft, 
  Phone,
  Video,
  Info
} from "lucide-react";

type Message = {
  id: string;
  from: "customer" | "admin";
  content: string;
  time: string;
};

type Conversation = {
  id: string;
  customer: string;
  activeText: string;
  status: "online" | "offline";
  messages: Message[];
};

const initialConversations: Conversation[] = [
  {
    id: "CS001",
    customer: "Nguyễn Văn An",
    activeText: "Đang hoạt động",
    status: "online",
    messages: [
      { id: "M001", from: "customer", content: "Shop ơi sách Đắc Nhân Tâm bản bìa cứng còn hàng không vậy?", time: "18:12" },
      {
        id: "M002",
        from: "admin",
        content: "Dạ chào anh An, bên em vẫn còn bản bìa cứng Đắc Nhân Tâm ạ. Không biết anh có muốn em lên đơn giữ hàng trước cho mình không?",
        time: "18:13",
      },
      { id: "M003", from: "customer", content: "Tuyệt quá, giữ cho mình 1 quyển nhé. Tí mình thanh toán qua ví điện tử luôn.", time: "18:14" },
    ],
  },
  {
    id: "CS002",
    customer: "Trần Thị Bình",
    activeText: "Hoạt động 5 phút trước",
    status: "offline",
    messages: [
      {
        id: "M004",
        from: "customer",
        content: "Đơn hàng sách Nhà Giả Kim của mình bao giờ thì giao đến Hà Nội vậy shop?",
        time: "17:40",
      },
      {
        id: "M005",
        from: "admin",
        content: "Dạ đơn hàng của chị Bình đã được bàn giao cho đơn vị vận chuyển. Dự kiến ngày mai hàng sẽ đến Hà Nội, shipper sẽ liên hệ trước khi phát hàng ạ.",
        time: "17:43",
      },
    ],
  },
  {
    id: "CS003",
    customer: "Lê Văn Cường",
    activeText: "Hoạt động 20 phút trước",
    status: "offline",
    messages: [
      {
        id: "M006",
        from: "customer",
        content: "Mình đặt nhầm địa chỉ nhận hàng rồi, shop có thể đổi địa chỉ nhận hộ mình được không?",
        time: "17:22",
      },
    ],
  },
];

export default function Chat() {
  const [search, setSearch] = useState("");
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [selectedConversationId, setSelectedConversationId] = useState(initialConversations[0]?.id ?? "");
  const [draftMessage, setDraftMessage] = useState("");
  
  // Mobile responsive view controller
  const [isMobileDetailActive, setIsMobileDetailActive] = useState(false);

  const filteredConversations = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return conversations;

    return conversations.filter((conversation) => {
      const latestMessage = conversation.messages[conversation.messages.length - 1]?.content ?? "";
      return (
        conversation.customer.toLowerCase().includes(keyword) ||
        latestMessage.toLowerCase().includes(keyword)
      );
    });
  }, [conversations, search]);

  const selectedConversation = useMemo(
    () => conversations.find((item) => item.id === selectedConversationId) ?? null,
    [conversations, selectedConversationId]
  );

  const handleSend = () => {
    const content = draftMessage.trim();
    if (!content || !selectedConversation) return;

    const newMessage: Message = {
      id: `M${Date.now()}`,
      from: "admin",
      content,
      time: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
    };

    setConversations((prev) =>
      prev.map((conversation) =>
        conversation.id === selectedConversation.id
          ? { ...conversation, messages: [...conversation.messages, newMessage] }
          : conversation
      )
    );

    setDraftMessage("");
  };

  const getInitials = (name: string) => {
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return `${parts[0]?.charAt(0)}${parts[parts.length - 1]?.charAt(0)}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const getAvatarBg = (name: string) => {
    const colors = [
      "bg-indigo-50 text-indigo-600 border-indigo-100",
      "bg-violet-50 text-violet-600 border-violet-100",
      "bg-emerald-50 text-emerald-600 border-emerald-100",
      "bg-amber-50 text-amber-600 border-amber-100",
    ];
    return colors[name.length % colors.length];
  };

  return (
    <section className="p-4 md:p-6 space-y-6 flex-1 flex flex-col h-[calc(100vh-100px)]">
      {/* HEADER */}
      <div className="flex-none">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
            <MessageSquare size={22} />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Hỗ trợ khách hàng</h1>
        </div>
        <p className="text-sm text-slate-500 mt-1">
          Kênh phản hồi và giải quyết các câu hỏi, yêu cầu trực tiếp từ người mua.
        </p>
      </div>

      {/* DOUBLE PANE CONTAINER */}
      <div className="flex-1 min-h-0 grid lg:grid-cols-3 rounded-2xl border border-slate-100 bg-white shadow-sm shadow-slate-100/50 overflow-hidden">
        
        {/* LEFT PANEL: CONVERSATIONS LIST */}
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
                onChange={(event) => setSearch(event.target.value)}
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
                      setSelectedConversationId(item.id);
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

        {/* RIGHT PANEL: CHAT VIEWPORT */}
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

                {/* Dummy call action icons for premium fidelity */}
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
                      {/* Avatar next to bubble for high fidelity */}
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
                    onChange={(event) => setDraftMessage(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        handleSend();
                      }
                    }}
                    placeholder={`Gửi phản hồi nhanh cho ${selectedConversation.customer}...`}
                    className="flex-1 rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm placeholder-slate-400 outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                  />
                  <button
                    type="button"
                    onClick={handleSend}
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
      </div>
    </section>
  );
}
