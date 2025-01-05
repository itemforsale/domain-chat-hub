import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';

export const useMediaControls = (mediaStream: React.MutableRefObject<MediaStream | null>) => {
  const [isMuted, setIsMuted] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const { toast } = useToast();

  const handleToggleMute = () => {
    if (mediaStream.current) {
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
    if (mediaStream.current) {
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

  return {
    isMuted,
    isVideoEnabled,
    setIsVideoEnabled,
    handleToggleMute,
    handleToggleVideo
  };
};