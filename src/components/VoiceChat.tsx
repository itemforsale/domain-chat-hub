import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Volume2, VolumeX, Users } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface VoiceChatProps {
  username: string;
}

export const VoiceChat = ({ username }: VoiceChatProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [connectedUsers, setConnectedUsers] = useState<string[]>([]);
  const { toast } = useToast();
  const audioContext = useRef<AudioContext | null>(null);
  const mediaStream = useRef<MediaStream | null>(null);
  
  const handleToggleVoice = async () => {
    try {
      if (!isConnected) {
        if (!audioContext.current) {
          audioContext.current = new AudioContext();
        }
        
        mediaStream.current = await navigator.mediaDevices.getUserMedia({ 
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
          } 
        });
        
        const source = audioContext.current.createMediaStreamSource(mediaStream.current);
        source.connect(audioContext.current.destination);
        
        // Simulate adding a new user to the voice chat
        setConnectedUsers(prev => [...prev, username]);
        
        setIsConnected(true);
        toast({
          title: "Voice chat connected",
          description: "You can now speak in the voice chat",
        });
      } else {
        if (mediaStream.current) {
          mediaStream.current.getTracks().forEach(track => track.stop());
          mediaStream.current = null;
        }
        
        if (audioContext.current) {
          await audioContext.current.close();
          audioContext.current = null;
        }
        
        // Remove user from connected users
        setConnectedUsers(prev => prev.filter(user => user !== username));
        
        setIsConnected(false);
        toast({
          title: "Voice chat disconnected",
          description: "Voice chat connection ended",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Voice chat error",
        description: error instanceof Error ? error.message : "Failed to connect to voice chat",
        variant: "destructive",
      });
    }
  };

  const handleToggleMute = async () => {
    if (isConnected && mediaStream.current) {
      mediaStream.current.getAudioTracks().forEach(track => {
        track.enabled = isMuted;
      });
      setIsMuted(!isMuted);
    }
  };

  useEffect(() => {
    return () => {
      if (mediaStream.current) {
        mediaStream.current.getTracks().forEach(track => track.stop());
      }
      if (audioContext.current) {
        audioContext.current.close();
      }
      setConnectedUsers(prev => prev.filter(user => user !== username));
    };
  }, [username]);

  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-secondary/50 backdrop-blur rounded-full shadow-sm">
      <Button
        size="icon"
        variant={isConnected ? "default" : "secondary"}
        onClick={handleToggleVoice}
      >
        {isConnected ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
      </Button>
      
      <Button
        size="icon"
        variant="ghost"
        onClick={handleToggleMute}
        disabled={!isConnected}
      >
        {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
      </Button>

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Users className="h-4 w-4" />
        <span>{connectedUsers.length} connected</span>
      </div>
    </div>
  );
};