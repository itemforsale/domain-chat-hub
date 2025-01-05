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
        // Request both audio and video permissions at once
        mediaStream.current = await navigator.mediaDevices.getUserMedia({ 
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
          video: {
            width: { min: 640, ideal: 1280, max: 1920 },
            height: { min: 480, ideal: 720, max: 1080 },
            facingMode: "user",
            frameRate: { ideal: 30 }
          }
        });
        
        // Initialize audio context after user interaction
        if (!audioContext.current) {
          audioContext.current = new AudioContext();
          const source = audioContext.current.createMediaStreamSource(mediaStream.current);
          const gainNode = audioContext.current.createGain();
          gainNode.gain.value = 0.8; // Slightly reduce volume to prevent feedback
          source.connect(gainNode);
          gainNode.connect(audioContext.current.destination);
        }

        // Set up video stream
        if (videoRef.current && mediaStream.current) {
          videoRef.current.srcObject = mediaStream.current;
          await videoRef.current.play().catch(e => console.error('Video play failed:', e));
        }
        
        setIsConnected(true);
        setIsVideoEnabled(true);
        toast({
          title: "Connected to video chat",
          description: "Your camera and microphone are now active",
        });

        // Check video quality
        if (mediaStream.current) {
          const videoTrack = mediaStream.current.getVideoTracks()[0];
          const capabilities = videoTrack.getCapabilities();
          const settings = videoTrack.getSettings();
          
          // Determine network status based on actual video settings
          if (settings.width && settings.width >= 1280) {
            setNetworkStatus('good');
          } else if (settings.width && settings.width >= 640) {
            setNetworkStatus('poor');
          } else {
            setNetworkStatus('poor');
          }

          // Set up video track constraints
          await videoTrack.applyConstraints({
            width: { ideal: 1280 },
            height: { ideal: 720 },
            frameRate: { max: 30 }
          }).catch(e => console.warn('Could not apply video constraints:', e));
        }
      } else {
        // Cleanup when disconnecting
        if (mediaStream.current) {
          mediaStream.current.getTracks().forEach(track => {
            track.stop();
          });
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
      console.error('Media device error:', error);
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
    // Cleanup function
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