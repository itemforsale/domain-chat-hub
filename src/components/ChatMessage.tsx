import { cn } from "@/lib/utils";

interface ChatMessageProps {
  content: string;
  sender: string;
  timestamp: string;
  isOwn?: boolean;
}

export const ChatMessage = ({ content, sender, timestamp, isOwn }: ChatMessageProps) => {
  const isGif = content.startsWith('[gif]') && content.endsWith('[/gif]');
  const gifUrl = isGif ? content.replace('[gif]', '').replace('[/gif]', '') : '';

  return (
    <div
      className={cn(
        "flex w-full gap-2 animate-fade-in",
        isOwn ? "flex-row-reverse" : "flex-row"
      )}
    >
      <div className="flex flex-col gap-1 max-w-[70%]">
        {isGif ? (
          <div className={cn(
            "rounded-2xl overflow-hidden shadow-sm",
            isOwn ? "ml-auto" : ""
          )}>
            <img src={gifUrl} alt="GIF" className="max-w-full h-auto" />
          </div>
        ) : (
          <div
            className={cn(
              "px-4 py-2 rounded-2xl text-sm shadow-sm",
              isOwn
                ? "bg-primary text-primary-foreground ml-auto"
                : "bg-secondary"
            )}
          >
            {content}
          </div>
        )}
        <div
          className={cn(
            "flex gap-2 text-xs text-muted-foreground",
            isOwn ? "flex-row-reverse" : "flex-row"
          )}
        >
          <span className="font-medium">{sender}</span>
          <span>{timestamp}</span>
        </div>
      </div>
    </div>
  );
};