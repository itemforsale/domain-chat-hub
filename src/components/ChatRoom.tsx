import { useState, useEffect } from "react";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Users } from "lucide-react";

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

interface ChatRoomProps {
  username: string;
  isAdmin?: boolean;
}

export const ChatRoom = ({ username, isAdmin }: ChatRoomProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [mods, setMods] = useState<string[]>([]);

  // Function to load messages from localStorage
  const loadMessages = () => {
    const savedMessages = localStorage.getItem('chatMessages');
    const savedMods = localStorage.getItem('chatMods');
    
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }

    if (savedMods) {
      setMods(JSON.parse(savedMods));
    }
  };

  // Initial load
  useEffect(() => {
    loadMessages();
  }, []);

  // Set up polling every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      loadMessages();
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleSendMessage = (content: string) => {
    // Check for mod command
    if (isAdmin && content.startsWith("/mod ")) {
      const modUsername = content.slice(5).trim();
      if (!mods.includes(modUsername)) {
        const newMods = [...mods, modUsername];
        setMods(newMods);
        localStorage.setItem('chatMods', JSON.stringify(newMods));
        
        const newMessage: Message = {
          id: messages.length + 1,
          content: `${modUsername} has been granted moderator status.`,
          sender: "System",
          timestamp: "Just now",
          isOwn: false,
          isAdmin: true,
        };
        const updatedMessages = [...messages, newMessage];
        setMessages(updatedMessages);
        localStorage.setItem('chatMessages', JSON.stringify(updatedMessages));
      }
      return;
    }

    // Check for domain sale command
    if (isAdmin && content.startsWith("/domain ")) {
      const domainContent = content.slice(8);
      const newMessage: Message = {
        id: messages.length + 1,
        content: domainContent,
        sender: username,
        timestamp: "Just now",
        isOwn: true,
        isAdmin,
        isDomainSale: true,
      };
      const updatedMessages = [...messages, newMessage];
      setMessages(updatedMessages);
      localStorage.setItem('chatMessages', JSON.stringify(updatedMessages));
      return;
    }

    // Check for ad command
    if (isAdmin && content.startsWith("/ad ")) {
      const adContent = content.slice(4);
      const newMessage: Message = {
        id: messages.length + 1,
        content: adContent,
        sender: username,
        timestamp: "Just now",
        isOwn: true,
        isAdmin,
        isAd: true,
      };
      const updatedMessages = [...messages, newMessage];
      setMessages(updatedMessages);
      localStorage.setItem('chatMessages', JSON.stringify(updatedMessages));
      return;
    }

    // Check for pin command
    if (isAdmin && content.startsWith("/pin ")) {
      const pinnedContent = content.slice(5);
      const newMessage: Message = {
        id: messages.length + 1,
        content: pinnedContent,
        sender: username,
        timestamp: "Just now",
        isOwn: true,
        isAdmin,
        isPinned: true,
      };
      const updatedMessages = [...messages, newMessage];
      setMessages(updatedMessages);
      localStorage.setItem('chatMessages', JSON.stringify(updatedMessages));
    } else {
      const newMessage: Message = {
        id: messages.length + 1,
        content,
        sender: username,
        timestamp: "Just now",
        isOwn: true,
        isAdmin,
        isMod: mods.includes(username),
      };
      const updatedMessages = [...messages, newMessage];
      setMessages(updatedMessages);
      localStorage.setItem('chatMessages', JSON.stringify(updatedMessages));
    }
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="p-4 border-b flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Users className="h-5 w-5" />
            Domain Chat
          </h2>
          <p className="text-sm text-muted-foreground">
            Connected users: 1
          </p>
        </div>
      </div>
      
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

      <ChatInput 
        onSendMessage={handleSendMessage} 
        isAdmin={isAdmin} 
      />
    </div>
  );
};