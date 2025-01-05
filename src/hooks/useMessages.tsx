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
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      loadMessages();
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const addMessage = (newMessage: Message) => {
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    localStorage.setItem('chatMessages', JSON.stringify(updatedMessages));
  };

  const addModerator = (modUsername: string) => {
    if (!mods.includes(modUsername)) {
      const newMods = [...mods, modUsername];
      setMods(newMods);
      localStorage.setItem('chatMods', JSON.stringify(newMods));
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