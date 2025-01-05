import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Smile, Gift } from "lucide-react";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { GiphyFetch } from "@giphy/js-fetch-api";

// Initialize Giphy - in a real app, this should come from environment variables
const gf = new GiphyFetch('pLURtkhVrUXr3KG25Gy5IvzziV5OrPlW');

interface ChatInputProps {
  onSendMessage: (message: string) => void;
}

export const ChatInput = ({ onSendMessage }: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const [gifs, setGifs] = useState<Array<{ id: string; url: string }>>([]);
  const [searchGif, setSearchGif] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
    }
  };

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setMessage((prev) => prev + emojiData.emoji);
  };

  const searchGifs = async (query: string) => {
    if (!query) return;
    try {
      const { data } = await gf.search(query, { limit: 10 });
      setGifs(data.map(gif => ({
        id: gif.id,
        url: gif.images.fixed_height.url
      })));
    } catch (error) {
      console.error('Error fetching GIFs:', error);
    }
  };

  const handleGifSelect = (url: string) => {
    onSendMessage(`[gif]${url}[/gif]`);
    setSearchGif("");
    setGifs([]);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 p-4 border-t bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              type="button" 
              size="icon" 
              variant="ghost"
              className="h-10 w-10"
            >
              <Smile className="h-5 w-5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" side="top">
            <EmojiPicker
              onEmojiClick={handleEmojiClick}
              width="100%"
              height="350px"
            />
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button 
              type="button" 
              size="icon" 
              variant="ghost"
              className="h-10 w-10"
            >
              <Gift className="h-5 w-5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4" side="top">
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Search GIFs..."
                value={searchGif}
                onChange={(e) => {
                  setSearchGif(e.target.value);
                  searchGifs(e.target.value);
                }}
              />
              <ScrollArea className="h-[300px]">
                <div className="grid grid-cols-2 gap-2">
                  {gifs.map((gif) => (
                    <img
                      key={gif.id}
                      src={gif.url}
                      alt="GIF"
                      className="w-full h-auto cursor-pointer rounded-md hover:opacity-80 transition-opacity"
                      onClick={() => handleGifSelect(gif.url)}
                    />
                  ))}
                </div>
              </ScrollArea>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <Input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
        className="flex-1"
      />
      <Button type="submit" size="icon" className="bg-primary hover:bg-primary/90">
        <Send className="h-4 w-4" />
      </Button>
    </form>
  );
};