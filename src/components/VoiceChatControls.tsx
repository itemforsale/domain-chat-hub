import React from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Video, VideoOff, Volume2, VolumeX, Users } from 'lucide-react';

interface VoiceChatControlsProps {
  isConnected: boolean;
  isMuted: boolean;
  isVideoEnabled: boolean;
  connectedCount: number;
  onToggleConnection: () => void;
  onToggleMute: () => void;
  onToggleVideo: () => void;
}

export const VoiceChatControls = ({
  isConnected,
  isMuted,
  isVideoEnabled,
  connectedCount,
  onToggleConnection,
  onToggleMute,
  onToggleVideo
}: VoiceChatControlsProps) => {
  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-secondary/50 backdrop-blur rounded-full shadow-sm">
      <Button
        size="icon"
        variant={isConnected ? "default" : "secondary"}
        onClick={onToggleConnection}
      >
        {isConnected ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
      </Button>
      
      <Button
        size="icon"
        variant="ghost"
        onClick={onToggleMute}
        disabled={!isConnected}
      >
        {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
      </Button>

      <Button
        size="icon"
        variant="ghost"
        onClick={onToggleVideo}
        disabled={!isConnected}
      >
        {isVideoEnabled ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
      </Button>

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Users className="h-4 w-4" />
        <span>{connectedCount} connected</span>
      </div>
    </div>
  );
};