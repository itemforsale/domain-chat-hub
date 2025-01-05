import React from 'react';
import { VideoElement } from './VideoElement';

interface LocalVideoPreviewProps {
  stream: MediaStream;
  peerId: string;
  onVideoElement: (peerId: string, video: HTMLVideoElement) => void;
}

export const LocalVideoPreview = ({ stream, peerId, onVideoElement }: LocalVideoPreviewProps) => {
  return (
    <div className="relative w-48 aspect-video bg-secondary rounded-lg overflow-hidden shadow-lg fixed bottom-4 right-4 z-50">
      <VideoElement
        stream={stream}
        peerId={peerId}
        isMuted={true}
        onVideoElement={onVideoElement}
      />
      <div className="absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded text-white text-xs">
        You (Preview)
      </div>
    </div>
  );
};