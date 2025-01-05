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
      videoRef.current.muted = isMuted;
      
      const video = videoRef.current;
      onVideoElement(peerId, video);

      const playVideo = () => {
        video.play().catch(console.error);
      };

      video.addEventListener('canplay', playVideo);
      return () => {
        video.removeEventListener('canplay', playVideo);
      };
    }
  }, [stream, peerId, isMuted, onVideoElement]);

  return (
    <video 
      ref={videoRef}
      className="w-full h-full object-cover rounded-lg"
    />
  );
};