import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Video, VideoOff, Volume2, VolumeX, Maximize2, PictureInPicture } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';

interface VoiceChatProps {
  username: string;
}

export const VoiceChat = ({ username }: VoiceChatProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(false);
  const [networkStatus, setNetworkStatus] = useState<'good' | 'poor' | 'offline'>('good');
  const { toast } = useToast();
  const audioContext = useRef<AudioContext | null>(null);
  const mediaStream = useRef<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const handleToggleConnection = async () => {
    try {
      if (!isConnected) {
        if (!audioContext.current) {
          audioContext.current = new AudioContext();
        }
        
        mediaStream.current = await navigator.mediaDevices.getUserMedia({ 
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: "user",
          }
        });
        
        if (audioContext.current) {
          const source = audioContext.current.createMediaStreamSource(mediaStream.current);
          source.connect(audioContext.current.destination);
        }

        if (videoRef.current && mediaStream.current) {
          videoRef.current.srcObject = mediaStream.current;
        }
        
        setIsConnected(true);
        setIsVideoEnabled(true);
        toast({
          title: "Connected to video chat",
          description: "Your camera and microphone are now active",
        });

        // Monitor connection quality
        if (mediaStream.current) {
          const track = mediaStream.current.getVideoTracks()[0];
          const capabilities = track.getCapabilities();
          setNetworkStatus(capabilities.width?.max && capabilities.width.max >= 1280 ? 'good' : 'poor');
        }
      } else {
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
        setNetworkStatus('offline');
        toast({
          title: "Disconnected from video chat",
          description: "Your media connection has ended",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Could not access media devices",
        description: "Please check your camera and microphone permissions",
        variant: "destructive",
      });
      setNetworkStatus('offline');
    }
  };

  const handleToggleMute = () => {
    if (isConnected && mediaStream.current) {
      const audioTracks = mediaStream.current.getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = isMuted;
      });
      setIsMuted(!isMuted);
      
      toast({
        title: isMuted ? "Microphone unmuted" : "Microphone muted",
        description: `Others ${isMuted ? "can" : "cannot"} hear you now`,
      });
    }
  };

  const handleToggleVideo = () => {
    if (isConnected && mediaStream.current) {
      const videoTracks = mediaStream.current.getVideoTracks();
      videoTracks.forEach(track => {
        track.enabled = !isVideoEnabled;
      });
      setIsVideoEnabled(!isVideoEnabled);
      
      toast({
        title: isVideoEnabled ? "Camera turned off" : "Camera turned on",
        description: `Others ${isVideoEnabled ? "cannot" : "can"} see you now`,
      });
    }
  };

  const handlePictureInPicture = async () => {
    try {
      if (videoRef.current) {
        if (document.pictureInPictureElement) {
          await document.exitPictureInPicture();
        } else {
          await videoRef.current.requestPictureInPicture();
        }
      }
    } catch (error) {
      toast({
        title: "Picture-in-picture failed",
        description: "Your browser might not support this feature",
        variant: "destructive",
      });
    }
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen();
      }
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
    };
  }, []);

  return (
    <div className="flex flex-col items-center gap-4">
      {isConnected && (
        <div className="relative w-64 h-48 bg-black/10 dark:bg-black/30 rounded-lg overflow-hidden shadow-lg">
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
          <div className="absolute top-2 left-2">
            <Badge variant={
              networkStatus === 'good' ? 'default' :
              networkStatus === 'poor' ? 'warning' : 'destructive'
            }>
              {networkStatus === 'good' ? 'HD' :
               networkStatus === 'poor' ? 'SD' : 'Offline'}
            </Badge>
          </div>
          <div className="absolute bottom-2 left-2 text-xs text-white bg-black/50 px-2 py-1 rounded">
            {username}
          </div>
          <div className="absolute top-2 right-2 flex gap-1">
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 bg-black/20 hover:bg-black/40"
              onClick={handlePictureInPicture}
            >
              <PictureInPicture className="h-4 w-4 text-white" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 bg-black/20 hover:bg-black/40"
              onClick={handleFullscreen}
            >
              <Maximize2 className="h-4 w-4 text-white" />
            </Button>
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