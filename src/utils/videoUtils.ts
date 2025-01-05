export const handlePictureInPicture = async (videoRef: React.RefObject<HTMLVideoElement>) => {
  try {
    if (!videoRef.current) {
      throw new Error('Video element not found');
    }

    // If video metadata isn't loaded yet, wait for it
    if (videoRef.current.readyState < 1) {
      await new Promise((resolve) => {
        const handleLoadedMetadata = () => {
          videoRef.current?.removeEventListener('loadedmetadata', handleLoadedMetadata);
          resolve(true);
        };
        videoRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);
      });
    }

    if (document.pictureInPictureElement) {
      await document.exitPictureInPicture();
    } else {
      await videoRef.current.requestPictureInPicture();
    }
  } catch (error) {
    console.error('Picture-in-picture error:', error);
    throw error;
  }
};

export const handleFullscreen = (videoRef: React.RefObject<HTMLVideoElement>) => {
  if (videoRef.current) {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      videoRef.current.requestFullscreen();
    }
  }
};