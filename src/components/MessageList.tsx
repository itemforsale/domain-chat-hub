import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "./ChatMessage";

interface Message {
  id: number;
  content: string;
  sender: string;
  timestamp: string;
  isOwn: boolean;
  isAdmin?: boolean;
  isPinned?: boolean;
  isMod?: boolean;
  isDomainSale?: boolean;
  isAd?: boolean;
}

interface MessageListProps {
  messages: Message[];
  mods: string[];
}

export const MessageList = ({ messages, mods }: MessageListProps) => {
  return (
    <ScrollArea className="flex-1 p-4">
      <div className="flex flex-col gap-4">
        {messages.map((message) => (
          <ChatMessage 
            key={message.id} 
            {...message} 
            isMod={mods.includes(message.sender)}
          />
        ))}
      </div>
    </ScrollArea>
  );
};