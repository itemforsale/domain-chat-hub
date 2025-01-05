import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Users } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import {
  LiveKitRoom,
  VideoConference,
  ControlBar,
  useTracks,
  RoomAudioRenderer,
} from '@livekit/components-react';
import '@livekit/components-styles';

interface VoiceChatProps {
  username: string;
}

export const VoiceChat = ({ username }: VoiceChatProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const { toast } = useToast();

  const handleConnect = async () => {
    try {
      if (!isConnected) {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        setIsConnected(true);
        toast({
          title: "Voice chat connected",
          description: "You can now speak in the voice chat",
        });
      } else {
        setIsConnected(false);
        toast({
          title: "Voice chat disconnected",
          description: "Voice chat connection ended",
        });
      }
    } catch (error) {
      toast({
        title: "Microphone access denied",
        description: "Please allow microphone access to use voice chat",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        size="icon"
        variant={isConnected ? "default" : "secondary"}
        onClick={handleConnect}
        className="animate-in fade-in duration-200"
      >
        {isConnected ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
      </Button>

      {isConnected && (
        <>
          <LiveKitRoom
            serverUrl="wss://domain-chat-hub.livekit.cloud"
            token="your-token-here"
            connect={true}
            room="main-room"
            onError={(error) => {
              console.error(error);
              toast({
                title: "Voice chat error",
                description: error.message,
                variant: "destructive",
              });
            }}
          >
            <RoomAudioRenderer />
            <div className="hidden">
              <VideoConference />
              <ControlBar />
            </div>
          </LiveKitRoom>
          
          <span className="text-xs font-medium text-muted-foreground animate-pulse flex items-center gap-1">
            <Users className="h-3 w-3" />
            Live • {username}
          </span>
        </>
      )}
    </div>
  );
};