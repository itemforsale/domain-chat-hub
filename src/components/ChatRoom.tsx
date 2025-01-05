import { useState } from "react";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: number;
  content: string;
  sender: string;
  timestamp: string;
  isOwn: boolean;
}

export const ChatRoom = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      content: "Welcome to the domain name chat! Feel free to discuss anything related to domains.",
      sender: "System",
      timestamp: "Just now",
      isOwn: false,
    },
  ]);

  const handleSendMessage = (content: string) => {
    const newMessage: Message = {
      id: messages.length + 1,
      content,
      sender: "You",
      timestamp: "Just now",
      isOwn: true,
    };
    setMessages([...messages, newMessage]);
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Domain Chat</h2>
        <p className="text-sm text-muted-foreground">
          Connected users: 1
        </p>
      </div>
      
      <ScrollArea className="flex-1 p-4">
        <div className="flex flex-col gap-4">
          {messages.map((message) => (
            <ChatMessage key={message.id} {...message} />
          ))}
        </div>
      </ScrollArea>

      <ChatInput onSendMessage={handleSendMessage} />
    </div>
  );
};