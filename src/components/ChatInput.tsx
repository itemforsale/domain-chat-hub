import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { GifPicker } from "./GifPicker";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isAdmin?: boolean;
}

export const ChatInput = ({ onSendMessage, isAdmin }: ChatInputProps) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
    }
  };

  const handleGifSelect = (gifUrl: string) => {
    onSendMessage(`[gif]${gifUrl}[/gif]`);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 p-4 border-t bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <Input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={isAdmin ? "Type your message, use /pin to pin, /mod to grant mod status, /domain for sales, or /ad for adverts..." : "Type your message..."}
        className="flex-1"
      />
      <GifPicker onGifSelect={handleGifSelect} />
      <Button type="submit" size="icon" className="bg-primary hover:bg-primary/90">
        <Send className="h-4 w-4" />
      </Button>
    </form>
  );
};