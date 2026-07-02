export type Message = {
  id: string;
  from: "customer" | "admin";
  content: string;
  time: string;
};

export type Conversation = {
  id: string;
  customer: string;
  activeText: string;
  status: "online" | "offline";
  messages: Message[];
};
