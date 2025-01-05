import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useConversation } from '@11labs/react';

interface VoiceChatProps {
  username: string;
}

export const VoiceChat = ({ username }: VoiceChatProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const { toast } = useToast();
  
  const conversation = useConversation({
    onConnect: () => {
      setIsConnected(true);
      toast({
        title: "Voice chat connected",
        description: "You can now speak in the voice chat",
      });
    },
    onDisconnect: () => {
      setIsConnected(false);
      toast({
        title: "Voice chat disconnected",
        description: "Voice chat connection ended",
        variant: "destructive",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Voice chat error",
        description: error.toString(),
        variant: "destructive",
      });
    }
  });

  const handleToggleVoice = async () => {
    try {
      if (!isConnected) {
        // Request microphone access
        await navigator.mediaDevices.getUserMedia({ audio: true });
        // Replace with your ElevenLabs agent ID
        await conversation.startSession({
          agentId: "your-agent-id-here"
        });
      } else {
        await conversation.endSession();
      }
    } catch (error) {
      toast({
        title: "Microphone access denied",
        description: "Please allow microphone access to use voice chat",
        variant: "destructive",
      });
    }
  };

  const handleToggleMute = async () => {
    if (isConnected) {
      await conversation.setVolume({ volume: isMuted ? 1 : 0 });
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-secondary/50 backdrop-blur rounded-full shadow-sm">
      <Button
        size="icon"
        variant={isConnected ? "default" : "secondary"}
        onClick={handleToggleVoice}
        className="animate-in fade-in duration-200"
      >
        {isConnected ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
      </Button>
      
      <Button
        size="icon"
        variant="ghost"
        onClick={handleToggleMute}
        disabled={!isConnected}
        className={!isConnected ? "opacity-50" : ""}
      >
        {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
      </Button>
      
      {isConnected && (
        <span className="text-xs font-medium text-muted-foreground animate-pulse">
          Live • {username}
        </span>
      )}
    </div>
  );
};