import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MessageCircle, Heart, Share2 } from "lucide-react";

interface FeedPostProps {
  username: string;
  avatar?: string;
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
}

export const FeedPost = ({
  username,
  avatar,
  content,
  timestamp,
  likes,
  comments,
}: FeedPostProps) => {
  return (
    <div className="p-4 border-b animate-fade-in">
      <div className="flex gap-3">
        <Avatar>
          <AvatarImage src={avatar} />
          <AvatarFallback>{username[0].toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold">{username}</span>
            <span className="text-sm text-muted-foreground">{timestamp}</span>
          </div>
          <p className="mt-2 text-sm">{content}</p>
          <div className="flex gap-4 mt-3">
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              <Heart className="w-4 h-4 mr-1" />
              {likes}
            </Button>
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              <MessageCircle className="w-4 h-4 mr-1" />
              {comments}
            </Button>
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              <Share2 className="w-4 h-4 mr-1" />
              Share
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};