import { useMemo, useState } from "react";
import { MessageSquare } from "lucide-react";
import type { Conversation, Message } from "@/modules/admin/chat/types/chat.type";
import ChatConversationsList from "@/modules/admin/chat/components/ChatConversationsList";
import ChatViewport from "@/modules/admin/chat/components/ChatViewport";

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

  return (
    <section className="flex-1 flex flex-col gap-4 p-4 h-[calc(100vh-100px)]">
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

      {/* DOUBLE PANE CONTAINER WITH card-custom */}
      <div className="flex-1 min-h-0 grid lg:grid-cols-3 card-custom overflow-hidden !p-0">
        <ChatConversationsList
          search={search}
          onSearchChange={setSearch}
          filteredConversations={filteredConversations}
          selectedConversationId={selectedConversationId}
          onSelectConversation={setSelectedConversationId}
          isMobileDetailActive={isMobileDetailActive}
          setIsMobileDetailActive={setIsMobileDetailActive}
        />
        
        <ChatViewport
          selectedConversation={selectedConversation}
          draftMessage={draftMessage}
          onDraftMessageChange={setDraftMessage}
          onSend={handleSend}
          isMobileDetailActive={isMobileDetailActive}
          setIsMobileDetailActive={setIsMobileDetailActive}
        />
      </div>
    </section>
  );
}
