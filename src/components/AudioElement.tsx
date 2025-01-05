import { useEffect, useRef } from 'react';

interface AudioElementProps {
  stream: MediaStream;
  peerId: string;
  isMuted: boolean;
  onAudioElement: (peerId: string, audio: HTMLAudioElement) => void;
}

export const AudioElement = ({ stream, peerId, isMuted, onAudioElement }: AudioElementProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.srcObject = stream;
      audioRef.current.autoplay = true;
      audioRef.current.volume = isMuted ? 0 : 1;
      
      const audio = audioRef.current;
      onAudioElement(peerId, audio);

      const playAudio = async () => {
        try {
          await audio.play();
          console.log('Audio playing for peer:', peerId);
        } catch (error) {
          console.error('Error playing audio:', error);
        }
      };

      audio.addEventListener('canplaythrough', playAudio);
      return () => {
        audio.removeEventListener('canplaythrough', playAudio);
      };
    }
  }, [stream, peerId, isMuted, onAudioElement]);

  return <audio ref={audioRef} />;
};