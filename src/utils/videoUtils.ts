export const handlePictureInPicture = async (videoRef: React.RefObject<HTMLVideoElement>) => {
  try {
    if (videoRef.current) {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else {
        await videoRef.current.requestPictureInPicture();
      }
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