import React, { useRef, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { VideoControls } from './video/VideoControls';
import { VideoDisplay } from './video/VideoDisplay';
import { useMediaStream } from '@/hooks/useMediaStream';
import { useMediaControls } from '@/hooks/useMediaControls';
import { handlePictureInPicture, handleFullscreen } from '@/utils/videoUtils';

interface VoiceChatProps {
  username: string;
}

export const VoiceChat = ({ username }: VoiceChatProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();
  
  const {
    isConnected,
    setIsConnected,
    networkStatus,
    mediaStream,
    initializeMediaStream,
    initializeAudioContext,
    setupVideoTrack,
    cleanup
  } = useMediaStream(username);

  const {
    isMuted,
    isVideoEnabled,
    setIsVideoEnabled,
    handleToggleMute,
    handleToggleVideo
  } = useMediaControls(mediaStream);
  
  const handleToggleConnection = async () => {
    try {
      if (!isConnected) {
        const stream = await initializeMediaStream();
        initializeAudioContext(stream);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(e => console.error('Video play failed:', e));
        }
        
        await setupVideoTrack(stream);
        setIsConnected(true);
        setIsVideoEnabled(true);
        
        toast({
          title: "Connected to video chat",
          description: "Your camera and microphone are now active",
        });
      } else {
        await cleanup();
        
        if (videoRef.current) {
          videoRef.current.srcObject = null;
        }
        
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
    }
  };

  useEffect(() => {
    return () => {
      cleanup();
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
        onPictureInPicture={() => handlePictureInPicture(videoRef)}
        onFullscreen={() => handleFullscreen(videoRef)}
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