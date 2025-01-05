import React from 'react';
import {
  LiveKitRoom,
  VideoConference,
  ControlBar,
} from '@livekit/components-react';
import '@livekit/components-styles';
import { useToast } from '@/hooks/use-toast';

interface VoiceChatProps {
  username: string;
}

export const VoiceChat = ({ username }: VoiceChatProps) => {
  const { toast } = useToast();
  // Using LiveKit's demo server - in production use your own server
  const url = "wss://demo.livekit.cloud";
  
  // Generate a proper token for the demo server
  // This is a temporary token for testing. In production, generate this server-side
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MzYxMTY0MDAsImlzcyI6ImRlbW8iLCJuYW1lIjoidXNlciIsIm5iZiI6MTcwNDU4MDQwMCwic3ViIjoidXNlciIsInZpZGVvIjp7InJvb20iOiJkb21haW4tY2hhdC1yb29tIiwicm9vbUpvaW4iOnRydWV9fQ.YNQv-GkwzuE_1yYGzjmDyNVGHJgby0x_zYIMHSUDEGY";

  return (
    <div className="w-64">
      <LiveKitRoom
        serverUrl={url}
        token={token}
        connect={true}
        room="domain-chat-room"
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