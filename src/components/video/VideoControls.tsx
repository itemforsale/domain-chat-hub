import React from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Video, VideoOff, Volume2, VolumeX } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface VideoControlsProps {
  isConnected: boolean;
  isMuted: boolean;
  isVideoEnabled: boolean;
  username: string;
  onToggleMute: () => void;
  onToggleVideo: () => void;
  onToggleConnection: () => void;
}

export const VideoControls = ({
  isConnected,
  isMuted,
  isVideoEnabled,
  username,
  onToggleMute,
  onToggleVideo,
  onToggleConnection,
}: VideoControlsProps) => {
  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-secondary/50 backdrop-blur rounded-full shadow-sm">
      <Button
        size="icon"
        variant={isConnected ? "default" : "secondary"}
        onClick={onToggleConnection}
        className="animate-in fade-in duration-200"
      >
        {isConnected ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
      </Button>
      
      <Button
        size="icon"
        variant="ghost"
        onClick={onToggleMute}
        disabled={!isConnected}
        className={!isConnected ? "opacity-50" : ""}
      >
        {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
      </Button>

      <Button
        size="icon"
        variant="ghost"
        onClick={onToggleVideo}
        disabled={!isConnected}
        className={!isConnected ? "opacity-50" : ""}
      >
        {isVideoEnabled ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
      </Button>
      
      {isConnected && (
        <span className="text-xs font-medium text-muted-foreground animate-pulse">
          Live • {username}
        </span>
      )}
    </div>
  );
};