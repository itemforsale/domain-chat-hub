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
            autoGainControl: true,
          },
          video,
        });

        // Ensure audio tracks are enabled by default
        mediaStream.getAudioTracks().forEach(track => {
          track.enabled = true;
        });

        console.log('Media stream obtained:', {
          audioTracks: mediaStream.getAudioTracks().length,
          videoTracks: mediaStream.getVideoTracks().length
        });

        setStream(mediaStream);
      } catch (err) {
        console.error('Media stream error:', err);
        setError(err instanceof Error ? err : new Error('Failed to get media stream'));
      }
    };

    getStream();

    return () => {
      if (stream) {
        console.log('Cleaning up media stream');
        stream.getTracks().forEach(track => {
          track.stop();
          console.log(`Track ${track.kind} stopped:`, track.enabled);
        });
      }
    };
  }, [video]);

  return { stream, error };
};