import { useMessages } from "@/hooks/useMessages";
import { ChatHeader } from "./ChatHeader";
import { MessageList } from "./MessageList";
import { ChatInput } from "./ChatInput";

interface ChatRoomProps {
  username: string;
  isAdmin?: boolean;
}

export const ChatRoom = ({ username, isAdmin }: ChatRoomProps) => {
  const { messages, mods, addMessage, addModerator } = useMessages();

  const handleSendMessage = (content: string) => {
    // Check for mod command
    if (isAdmin && content.startsWith("/mod ")) {
      const modUsername = content.slice(5).trim();
      if (addModerator(modUsername)) {
        const newMessage = {
          id: messages.length + 1,
          content: `${modUsername} has been granted moderator status.`,
          sender: "System",
          timestamp: "Just now",
          isOwn: false,
          isAdmin: true,
        };
        addMessage(newMessage);
      }
      return;
    }

    // Check for domain sale command
    if (isAdmin && content.startsWith("/domain ")) {
      const domainContent = content.slice(8);
      const newMessage = {
        id: messages.length + 1,
        content: domainContent,
        sender: username,
        timestamp: "Just now",
        isOwn: true,
        isAdmin,
        isDomainSale: true,
      };
      addMessage(newMessage);
      return;
    }

    // Check for ad command
    if (isAdmin && content.startsWith("/ad ")) {
      const adContent = content.slice(4);
      const newMessage = {
        id: messages.length + 1,
        content: adContent,
        sender: username,
        timestamp: "Just now",
        isOwn: true,
        isAdmin,
        isAd: true,
      };
      addMessage(newMessage);
      return;
    }

    // Check for pin command
    if (isAdmin && content.startsWith("/pin ")) {
      const pinnedContent = content.slice(5);
      const newMessage = {
        id: messages.length + 1,
        content: pinnedContent,
        sender: username,
        timestamp: "Just now",
        isOwn: true,
        isAdmin,
        isPinned: true,
      };
      addMessage(newMessage);
    } else {
      const newMessage = {
        id: messages.length + 1,
        content,
        sender: username,
        timestamp: "Just now",
        isOwn: true,
        isAdmin,
        isMod: mods.includes(username),
      };
      addMessage(newMessage);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <ChatHeader />
      <MessageList messages={messages} mods={mods} />
      <ChatInput 
        onSendMessage={handleSendMessage} 
        isAdmin={isAdmin} 
      />
    </div>
  );
};