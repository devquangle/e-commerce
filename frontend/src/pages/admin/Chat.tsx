import { useMemo, useState } from "react";

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
  messages: Message[];
};

const initialConversations: Conversation[] = [
  {
    id: "CS001",
    customer: "Nguyen Van A",
    activeText: "Đang hoạt động",
    messages: [
      { id: "M001", from: "customer", content: "Shop ơi còn màu đen không?", time: "18:12" },
      {
        id: "M002",
        from: "admin",
        content: "Dạ còn màu đen ạ, mình cần em giữ hàng không?",
        time: "18:13",
      },
      { id: "M003", from: "customer", content: "Ok bạn, mình lấy 1 cái.", time: "18:14" },
    ],
  },
  {
    id: "CS002",
    customer: "Tran Thi B",
    activeText: "Hoạt động 5 phút trước",
    messages: [
      {
        id: "M004",
        from: "customer",
        content: "Đơn hàng của mình bao giờ giao vậy shop?",
        time: "17:40",
      },
      {
        id: "M005",
        from: "admin",
        content: "Đơn của mình dự kiến giao ngày mai, bên em sẽ gọi trước khi giao ạ.",
        time: "17:43",
      },
    ],
  },
  {
    id: "CS003",
    customer: "Le Van C",
    activeText: "Hoạt động 20 phút trước",
    messages: [
      {
        id: "M006",
        from: "customer",
        content: "Mình muốn đổi địa chỉ nhận hàng được không?",
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
    <section className="space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Hỗ trợ chat khách hàng</h1>
        <p className="text-sm text-gray-500">Theo dõi hội thoại và phản hồi nhanh các yêu cầu hỗ trợ.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <div className="mb-3">
            <input
              type="text"
              placeholder="Tìm hội thoại..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none ring-indigo-500 focus:ring-2"
            />
          </div>
          <div className="space-y-2">
            {filteredConversations.map((item) => {
              const lastMessage = item.messages[item.messages.length - 1];
              const isActive = selectedConversationId === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedConversationId(item.id)}
                  className={`w-full rounded-lg border p-3 text-left transition ${
                    isActive
                      ? "border-indigo-300 bg-indigo-50"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <p className="font-medium text-gray-900">{item.customer}</p>
                  <p className="line-clamp-1 text-sm text-gray-600">{lastMessage?.content ?? ""}</p>
                  <p className="mt-1 text-xs text-gray-400">{lastMessage?.time ?? ""}</p>
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-xl border bg-white p-4 shadow-sm lg:col-span-2">
          {selectedConversation ? (
            <>
              <div className="mb-3 border-b pb-3">
                <h2 className="font-semibold text-gray-900">{selectedConversation.customer}</h2>
                <p className="text-xs text-gray-500">{selectedConversation.activeText}</p>
              </div>

              <div className="mb-4 h-80 space-y-3 overflow-y-auto rounded-lg bg-gray-50 p-3">
                {selectedConversation.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`max-w-xs rounded-lg p-3 text-sm shadow-sm ${
                      message.from === "admin"
                        ? "ml-auto bg-indigo-600 text-white"
                        : "bg-white text-gray-700"
                    }`}
                  >
                    <p>{message.content}</p>
                    <p
                      className={`mt-1 text-right text-[10px] ${
                        message.from === "admin" ? "text-indigo-100" : "text-gray-400"
                      }`}
                    >
                      {message.time}
                    </p>
                  </div>
                ))}
              </div>

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
                  placeholder="Nhập tin nhắn..."
                  className="flex-1 rounded-lg border px-3 py-2 text-sm outline-none ring-indigo-500 focus:ring-2"
                />
                <button
                  type="button"
                  onClick={handleSend}
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                >
                  Gửi
                </button>
              </div>
            </>
          ) : (
            <div className="flex h-80 items-center justify-center rounded-lg border border-dashed text-sm text-gray-500">
              Chọn một hội thoại để xem nội dung tin nhắn.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
