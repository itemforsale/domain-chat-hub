import { cn } from "@/lib/utils";
import emojiRegex from 'emoji-regex';
import React from 'react';
import { Globe } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getCountryFromIp } from "@/utils/getCountryFromIp";

interface ChatMessageProps {
  content: string;
  sender: string;
  senderIp?: string;
  timestamp: string;
  isOwn?: boolean;
  isAdmin?: boolean;
  isPinned?: boolean;
  isMod?: boolean;
  isDomainSale?: boolean;
  isAd?: boolean;
}

export const ChatMessage = ({ 
  content, 
  sender, 
  senderIp, 
  timestamp, 
  isOwn, 
  isAdmin, 
  isPinned, 
  isMod, 
  isDomainSale, 
  isAd 
}: ChatMessageProps) => {
  const [countryCode, setCountryCode] = useState<string>('');
  const [countryName, setCountryName] = useState<string>('');

  useEffect(() => {
    const fetchCountry = async () => {
      if (senderIp && !isAdmin) {
        const { country_code, country_name } = await getCountryFromIp(senderIp);
        setCountryCode(country_code);
        setCountryName(countryName);
      }
    };

    fetchCountry();
  }, [senderIp, isAdmin]);

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

    // Handle URLs in special messages
    if (isPinned || isMod || isDomainSale || isAd) {
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
        (isPinned || isDomainSale || isAd) ? "w-full" : "max-w-[70%]"
      )}>
        <div
          className={cn(
            "px-4 py-2 rounded-2xl text-sm shadow-sm",
            isDomainSale ? "bg-green-100 border-2 border-green-400 w-full text-lg font-bold" :
            isAd ? "bg-purple-100 border-2 border-purple-400 w-full text-lg" :
            isPinned ? "bg-yellow-100 border-2 border-yellow-400 w-full text-lg" :
            isAdmin ? "bg-purple-600 text-white text-lg font-bold" :
            isMod ? "bg-blue-100 text-lg" : 
            isOwn ? "bg-primary text-primary-foreground" : "bg-secondary"
          )}
        >
          {isDomainSale && (
            <div className="font-bold text-green-700 mb-1">🌐 Domain For Sale</div>
          )}
          {isAd && (
            <div className="font-bold text-purple-700 mb-1">📢 Advertisement</div>
          )}
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
            {senderIp && !isAdmin && (
              <>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  ({senderIp})
                  <span className="tooltip" title={countryName}>
                    {countryCode ? (
                      <img 
                        src={`https://flagcdn.com/16x12/${countryCode.toLowerCase()}.png`}
                        alt={countryName}
                        className="inline-block ml-1"
                      />
                    ) : (
                      <Globe className="h-4 w-4 text-muted-foreground" />
                    )}
                  </span>
                </span>
              </>
            )}
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