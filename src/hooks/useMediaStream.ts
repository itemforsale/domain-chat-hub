import { useRef, useState } from 'react';
import { useToast } from '@/components/ui/use-toast';

export type NetworkStatus = 'good' | 'poor' | 'offline';

export const useMediaStream = (username: string) => {
  const [isConnected, setIsConnected] = useState(false);
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>('good');
  const audioContext = useRef<AudioContext | null>(null);
  const mediaStream = useRef<MediaStream | null>(null);
  const { toast } = useToast();

  const initializeMediaStream = async () => {
    try {
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

      return mediaStream.current;
    } catch (error) {
      console.error('Media device error:', error);
      throw error;
    }
  };

  const initializeAudioContext = (stream: MediaStream) => {
    if (!audioContext.current) {
      audioContext.current = new AudioContext();
      const source = audioContext.current.createMediaStreamSource(stream);
      const gainNode = audioContext.current.createGain();
      gainNode.gain.value = 0.8;
      source.connect(gainNode);
      gainNode.connect(audioContext.current.destination);
    }
  };

  const setupVideoTrack = async (stream: MediaStream) => {
    const videoTrack = stream.getVideoTracks()[0];
    const settings = videoTrack.getSettings();
    
    if (settings.width && settings.width >= 1280) {
      setNetworkStatus('good');
    } else if (settings.width && settings.width >= 640) {
      setNetworkStatus('poor');
    } else {
      setNetworkStatus('poor');
    }

    await videoTrack.applyConstraints({
      width: { ideal: 1280 },
      height: { ideal: 720 },
      frameRate: { max: 30 }
    }).catch(e => console.warn('Could not apply video constraints:', e));
  };

  const cleanup = async () => {
    if (mediaStream.current) {
      mediaStream.current.getTracks().forEach(track => track.stop());
      mediaStream.current = null;
    }
    
    if (audioContext.current) {
      await audioContext.current.close();
      audioContext.current = null;
    }

    setNetworkStatus('offline');
    setIsConnected(false);
  };

  return {
    isConnected,
    setIsConnected,
    networkStatus,
    setNetworkStatus,
    mediaStream,
    audioContext,
    initializeMediaStream,
    initializeAudioContext,
    setupVideoTrack,
    cleanup
  };
};