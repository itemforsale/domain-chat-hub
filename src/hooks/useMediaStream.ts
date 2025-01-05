import { useState, useEffect } from 'react';

export const useMediaStream = (video: boolean = false) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const getStream = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
          },
          video,
        });
        setStream(mediaStream);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to get media stream'));
      }
    };

    getStream();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [video]);

  return { stream, error };
};