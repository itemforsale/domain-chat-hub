import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Video, VideoOff, Volume2, VolumeX } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface VoiceChatProps {
  username: string;
}

export const VoiceChat = ({ username }: VoiceChatProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(false);
  const { toast } = useToast();
  const audioContext = useRef<AudioContext | null>(null);
  const mediaStream = useRef<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const handleToggleConnection = async () => {
    try {
      if (!isConnected) {
        // Initialize audio context if not already done
        if (!audioContext.current) {
          audioContext.current = new AudioContext();
        }
        
        // Request media access with both audio and video
        mediaStream.current = await navigator.mediaDevices.getUserMedia({ 
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
          },
          video: true
        });
        
        // Connect the audio to the audio context
        if (audioContext.current) {
          const source = audioContext.current.createMediaStreamSource(mediaStream.current);
          source.connect(audioContext.current.destination);
        }

        // Set video stream
        if (videoRef.current && mediaStream.current) {
          videoRef.current.srcObject = mediaStream.current;
        }
        
        setIsConnected(true);
        setIsVideoEnabled(true);
        toast({
          title: "Media connected",
          description: "Audio and video are now available",
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

        if (videoRef.current) {
          videoRef.current.srcObject = null;
        }
        
        setIsConnected(false);
        setIsVideoEnabled(false);
        toast({
          title: "Disconnected",
          description: "Media connection ended",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Media access denied",
        description: "Please allow camera and microphone access",
        variant: "destructive",
      });
    }
  };

  const handleToggleMute = () => {
    if (isConnected && mediaStream.current) {
      const audioTracks = mediaStream.current.getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = isMuted;
      });
      setIsMuted(!isMuted);
    }
  };

  const handleToggleVideo = () => {
    if (isConnected && mediaStream.current) {
      const videoTracks = mediaStream.current.getVideoTracks();
      videoTracks.forEach(track => {
        track.enabled = !isVideoEnabled;
      });
      setIsVideoEnabled(!isVideoEnabled);
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
    <div className="flex flex-col items-center gap-4">
      {isConnected && (
        <div className="relative w-64 h-48 bg-black/10 dark:bg-black/30 rounded-lg overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`w-full h-full object-cover brightness-100 contrast-100 ${isVideoEnabled ? 'opacity-100' : 'opacity-0'}`}
          />
          {!isVideoEnabled && (
            <div className="absolute inset-0 flex items-center justify-center text-foreground">
              <VideoOff className="w-8 h-8" />
            </div>
          )}
          <div className="absolute bottom-2 left-2 text-xs text-white bg-black/50 px-2 py-1 rounded">
            {username}
          </div>
        </div>
      )}
      
      <div className="flex items-center gap-2 px-4 py-2 bg-secondary/50 backdrop-blur rounded-full shadow-sm">
        <Button
          size="icon"
          variant={isConnected ? "default" : "secondary"}
          onClick={handleToggleConnection}
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

        <Button
          size="icon"
          variant="ghost"
          onClick={handleToggleVideo}
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
    </div>
  );
};