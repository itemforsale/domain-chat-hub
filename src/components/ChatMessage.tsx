import { cn } from "@/lib/utils";
import emojiRegex from 'emoji-regex';
import React from 'react';

interface ChatMessageProps {
  content: string;
  sender: string;
  timestamp: string;
  isOwn?: boolean;
  isAdmin?: boolean;
}

export const ChatMessage = ({ content, sender, timestamp, isOwn, isAdmin }: ChatMessageProps) => {
  const renderMessageContent = (text: string) => {
    // Check if the message contains a GIF
    const gifMatch = text.match(/\[gif\](.*?)\[\/gif\]/);
    if (gifMatch) {
      return (
        <img 
          src={gifMatch[1]} 
          alt="GIF" 
          className="rounded-lg max-w-[200px] max-h-[200px] object-contain"
        />
      );
    }

    // Handle regular messages with emojis
    const regex = emojiRegex();
    const parts = text.split(regex);
    const matches = text.match(regex) || [];
    
    return parts.map((part, i) => (
      <React.Fragment key={i}>
        {part}
        {matches[i] && <span className="emoji">{matches[i]}</span>}
      </React.Fragment>
    ));
  };

  return (
    <div
      className={cn(
        "flex w-full gap-2 animate-fade-in",
        isOwn ? "flex-row-reverse" : "flex-row"
      )}
    >
      <div className="flex flex-col gap-1 max-w-[70%]">
        <div
          className={cn(
            "px-4 py-2 rounded-2xl text-sm shadow-sm",
            isAdmin ? "bg-purple-600 text-white text-lg font-bold" : 
            isOwn ? "bg-primary text-primary-foreground" : "bg-secondary"
          )}
        >
          {renderMessageContent(content)}
        </div>
        <div
          className={cn(
            "flex gap-2 text-xs text-muted-foreground",
            isOwn ? "flex-row-reverse" : "flex-row"
          )}
        >
          <span className={cn("font-medium", isAdmin && "text-purple-600")}>
            {sender}
          </span>
          <span>{timestamp}</span>
        </div>
      </div>
    </div>
  );
};