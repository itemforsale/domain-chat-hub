import React from 'react';
import {
  LiveKitRoom,
  VideoConference,
  ControlBar,
  useTracks,
} from '@livekit/components-react';
import '@livekit/components-styles';
import { Track } from 'livekit-client';
import { useToast } from '@/components/ui/use-toast';

interface VoiceChatProps {
  username: string;
}

export const VoiceChat = ({ username }: VoiceChatProps) => {
  const { toast } = useToast();
  // Using LiveKit's demo server for testing. In production, use your own LiveKit server
  const url = "wss://demo.livekit.cloud";
  const token = "devkey"; // For demo only. In production, generate this token server-side

  return (
    <div className="w-64">
      <LiveKitRoom
        serverUrl={url}
        token={token}
        connect={true}
        name="domain-chat-room"
        onError={(error) => {
          console.error(error);
          toast({
            title: "Connection Error",
            description: "Failed to connect to video chat",
            variant: "destructive",
          });
        }}
      >
        <div className="relative w-64 h-48 bg-black/10 dark:bg-black/30 rounded-lg overflow-hidden shadow-lg">
          <VideoConference />
        </div>
        <ControlBar />
      </LiveKitRoom>
    </div>
  );
};