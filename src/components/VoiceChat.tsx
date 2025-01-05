import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface VoiceChatProps {
  username: string;
}

export const VoiceChat = ({ username }: VoiceChatProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const { toast } = useToast();
  const audioContext = useRef<AudioContext | null>(null);
  const mediaStream = useRef<MediaStream | null>(null);
  
  const handleToggleVoice = async () => {
    try {
      if (!isConnected) {
        // Initialize audio context if not already done
        if (!audioContext.current) {
          audioContext.current = new AudioContext();
        }
        
        // Request microphone access
        mediaStream.current = await navigator.mediaDevices.getUserMedia({ 
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
          } 
        });
        
        // Connect the microphone to the audio context
        const source = audioContext.current.createMediaStreamSource(mediaStream.current);
        source.connect(audioContext.current.destination);
        
        setIsConnected(true);
        toast({
          title: "Voice chat connected",
          description: "You can now speak in the voice chat",
        });
      } else {
        // Disconnect and cleanup
        if (mediaStream.current) {
          mediaStream.current.getTracks().forEach(track => track.stop());
          mediaStream.current = null;
        }
        
        if (audioContext.current) {
          await audioContext.current.close();
          audioContext.current = null;
        }
        
        setIsConnected(false);
        toast({
          title: "Voice chat disconnected",
          description: "Voice chat connection ended",
          variant: "destructive",
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

  const handleToggleMute = async () => {
    if (isConnected && mediaStream.current) {
      mediaStream.current.getAudioTracks().forEach(track => {
        track.enabled = isMuted;
      });
      setIsMuted(!isMuted);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (mediaStream.current) {
        mediaStream.current.getTracks().forEach(track => track.stop());
      }
      if (audioContext.current) {
        audioContext.current.close();
      }
    };
  }, []);

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