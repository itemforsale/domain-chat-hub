import React, { useState, useRef, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { VideoControls } from './video/VideoControls';
import { VideoDisplay } from './video/VideoDisplay';

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
      <VideoDisplay
        isConnected={isConnected}
        isVideoEnabled={isVideoEnabled}
        networkStatus={networkStatus}
        username={username}
        videoRef={videoRef}
        onPictureInPicture={handlePictureInPicture}
        onFullscreen={handleFullscreen}
      />
      
      <VideoControls
        isConnected={isConnected}
        isMuted={isMuted}
        isVideoEnabled={isVideoEnabled}
        username={username}
        onToggleMute={handleToggleMute}
        onToggleVideo={handleToggleVideo}
        onToggleConnection={handleToggleConnection}
      />
    </div>
  );
};