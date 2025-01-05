import React, { useState } from 'react';
import { GiphyFetch } from '@giphy/js-fetch-api';
import { Grid } from '@giphy/react-components';
import { Button } from './ui/button';
import { GiftIcon } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from './ui/input';

// Using the public beta key - in production, you should use your own API key
const gf = new GiphyFetch('GlVGYHkr3WSBnllca54iNt0yFbjz7L65');

interface GifPickerProps {
  onGifSelect: (gifUrl: string) => void;
}

export const GifPicker = ({ onGifSelect }: GifPickerProps) => {
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);

  const fetchGifs = (offset: number) =>
    search
      ? gf.search(search, { offset, limit: 10 })
      : gf.trending({ offset, limit: 10 });

  const handleGifClick = (gif: any, e?: React.SyntheticEvent) => {
    if (e) {
      e.preventDefault();
    }
    onGifSelect(gif.images.original.url);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-accent"
          type="button"
        >
          <GiftIcon className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-2 border-b">
          <Input
            placeholder="Search GIFs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="h-[300px] overflow-auto">
          <Grid
            onGifClick={handleGifClick}
            fetchGifs={fetchGifs}
            width={280}
            columns={2}
            gutter={6}
            noLink={true}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
};