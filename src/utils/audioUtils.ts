export const setupAudioContext = async () => {
  const context = new AudioContext();
  await context.resume();
  return context;
};

export const setupMediaStream = async () => {
  return navigator.mediaDevices.getUserMedia({ 
    audio: {
      echoCancellation: true,
      noiseSuppression: true,
    } 
  });
};

export const setMicrophoneState = (mediaStream: MediaStream, enabled: boolean) => {
  mediaStream.getAudioTracks().forEach(track => {
    track.enabled = enabled;
  });
};

export const setAudioElementsVolume = (
  audioElements: Map<string, HTMLAudioElement>,
  volume: number
) => {
  audioElements.forEach((audio) => {
    audio.volume = volume;
  });
};