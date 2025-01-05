import { useEffect, useRef } from 'react';

interface VideoElementProps {
  stream: MediaStream;
  peerId: string;
  isMuted: boolean;
  onVideoElement: (peerId: string, video: HTMLVideoElement) => void;
}

export const VideoElement = ({ stream, peerId, isMuted, onVideoElement }: VideoElementProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.autoplay = true;
      videoRef.current.playsInline = true; // Important for mobile devices
      videoRef.current.muted = isMuted;
      
      const video = videoRef.current;
      onVideoElement(peerId, video);

      const playVideo = async () => {
        try {
          await video.play();
        } catch (error) {
          console.error('Error playing video:', error);
        }
      };

      video.addEventListener('loadedmetadata', playVideo);
      return () => {
        video.removeEventListener('loadedmetadata', playVideo);
      };
    }
  }, [stream, peerId, isMuted, onVideoElement]);

  return (
    <video 
      ref={videoRef}
      className="w-full h-full object-cover"
      style={{ transform: 'scaleX(-1)' }} // Mirror the video for selfie view
    />
  );
};