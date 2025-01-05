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
      const audio = audioRef.current;
      
      // Set audio properties
      audio.srcObject = stream;
      audio.autoplay = true;
      audio.volume = isMuted ? 0 : 1;
      
      console.log('Setting up audio element for peer:', peerId, {
        hasAudioTracks: stream.getAudioTracks().length > 0,
        trackStates: stream.getAudioTracks().map(track => ({
          enabled: track.enabled,
          muted: track.muted,
          readyState: track.readyState
        }))
      });

      onAudioElement(peerId, audio);

      const playAudio = async () => {
        try {
          await audio.play();
          console.log('Audio playing successfully for peer:', peerId);
        } catch (error) {
          console.error('Error playing audio:', error);
          // Retry play on user interaction
          const retryPlay = async () => {
            try {
              await audio.play();
              document.removeEventListener('click', retryPlay);
            } catch (retryError) {
              console.error('Retry play failed:', retryError);
            }
          };
          document.addEventListener('click', retryPlay);
        }
      };

      audio.addEventListener('canplaythrough', playAudio);
      
      return () => {
        audio.removeEventListener('canplaythrough', playAudio);
        audio.srcObject = null;
      };
    }
  }, [stream, peerId, isMuted, onAudioElement]);

  return <audio ref={audioRef} />;
};