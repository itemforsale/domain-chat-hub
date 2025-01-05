import { cn } from "@/lib/utils";
import emojiRegex from 'emoji-regex';
import React from 'react';

interface ChatMessageProps {
  content: string;
  sender: string;
  timestamp: string;
  isOwn?: boolean;
  isAdmin?: boolean;
  isPinned?: boolean;
  isMod?: boolean;
}

export const ChatMessage = ({ content, sender, timestamp, isOwn, isAdmin, isPinned, isMod }: ChatMessageProps) => {
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

    // Handle URLs in pinned messages or mod messages
    if (isPinned || isMod) {
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      const parts = text.split(urlRegex);
      const matches = text.match(urlRegex) || [];
      
      return parts.map((part, i) => (
        <React.Fragment key={i}>
          {matches[i] ? (
            <a 
              href={matches[i]} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-blue-500 hover:underline"
            >
              {matches[i]}
            </a>
          ) : (
            part
          )}
        </React.Fragment>
      ));
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
      <div className={cn(
        "flex flex-col gap-1",
        isPinned ? "w-full" : "max-w-[70%]"
      )}>
        <div
          className={cn(
            "px-4 py-2 rounded-2xl text-sm shadow-sm",
            isPinned ? "bg-yellow-100 border-2 border-yellow-400 w-full text-lg" :
            isAdmin ? "bg-purple-600 text-white text-lg font-bold" :
            isMod ? "bg-blue-100 text-lg" : 
            isOwn ? "bg-primary text-primary-foreground" : "bg-secondary"
          )}
        >
          {isPinned && (
            <div className="font-bold text-yellow-700 mb-1">📌 Pinned Message</div>
          )}
          {renderMessageContent(content)}
        </div>
        <div
          className={cn(
            "flex gap-2 text-xs text-muted-foreground",
            isOwn ? "flex-row-reverse" : "flex-row"
          )}
        >
          <div className={cn(
            "font-medium flex items-center gap-2",
            isAdmin ? "text-2xl text-purple-600 font-bold" : "",
            isMod && "animate-pulse text-blue-600"
          )}>
            {sender}
            {isAdmin && (
              <>
                <span className="text-3xl">⭐</span>
                <span className="text-lg font-bold text-purple-600">Admin</span>
                <a 
                  href="https://x.com/i/communities/1679163145921626113" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-blue-500 hover:underline ml-2"
                >
                  X Community →
                </a>
              </>
            )}
            {isMod && "🛡️"}
          </div>
          <span>{timestamp}</span>
        </div>
      </div>
    </div>
  );
};