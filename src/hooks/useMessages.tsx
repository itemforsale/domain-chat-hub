import { useState, useEffect } from "react";

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

export const useMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [mods, setMods] = useState<string[]>([]);
  
  // Create a broadcast channel for cross-window communication
  const broadcastChannel = new BroadcastChannel('chat_messages');

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

  useEffect(() => {
    loadMessages();

    // Listen for messages from other windows/tabs
    const handleBroadcast = (event: MessageEvent) => {
      const { type, data } = event.data;
      
      if (type === 'newMessage') {
        setMessages(data);
      } else if (type === 'newMod') {
        setMods(data);
      }
    };

    broadcastChannel.addEventListener('message', handleBroadcast);

    const interval = setInterval(() => {
      loadMessages();
    }, 2000);

    return () => {
      clearInterval(interval);
      broadcastChannel.removeEventListener('message', handleBroadcast);
      broadcastChannel.close();
    };
  }, []);

  const addMessage = (newMessage: Message) => {
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    localStorage.setItem('chatMessages', JSON.stringify(updatedMessages));
    
    // Broadcast the new messages to other windows/tabs
    broadcastChannel.postMessage({
      type: 'newMessage',
      data: updatedMessages
    });
  };

  const addModerator = (modUsername: string) => {
    if (!mods.includes(modUsername)) {
      const newMods = [...mods, modUsername];
      setMods(newMods);
      localStorage.setItem('chatMods', JSON.stringify(newMods));
      
      // Broadcast the new mods list to other windows/tabs
      broadcastChannel.postMessage({
        type: 'newMod',
        data: newMods
      });
      return true;
    }
    return false;
  };

  return {
    messages,
    mods,
    addMessage,
    addModerator
  };
};