import { useEffect } from 'react';
import type { MediaConnection } from 'peerjs';
import { AudioElement } from './AudioElement';
import { VideoElement } from './VideoElement';

interface PeerConnectionsProps {
  peers: Map<string, MediaConnection>;
  isMuted: boolean;
  onAudioElement: (peerId: string, audio: HTMLAudioElement) => void;
  onVideoElement: (peerId: string, video: HTMLVideoElement) => void;
}

export const PeerConnections = ({ 
  peers,
  isMuted,
  onAudioElement,
  onVideoElement
}: PeerConnectionsProps) => {
  // Calculate grid columns based on number of peers
  const getGridCols = (peerCount: number) => {
    if (peerCount <= 4) return 'grid-cols-2';
    if (peerCount <= 9) return 'grid-cols-3';
    if (peerCount <= 16) return 'grid-cols-4';
    if (peerCount <= 25) return 'grid-cols-5';
    return 'grid-cols-6';
  };

  const peerCount = peers.size;
  const gridCols = getGridCols(peerCount);

  return (
    <div className={`grid ${gridCols} gap-2 p-2 max-h-[calc(100vh-200px)] overflow-y-auto`}>
      {Array.from(peers.entries()).map(([peerId, connection]) => (
        <div 
          key={peerId} 
          className="relative aspect-video bg-secondary rounded-lg overflow-hidden shadow-lg hover:ring-2 hover:ring-primary transition-all"
        >
          {connection.remoteStream && (
            <>
              <AudioElement
                stream={connection.remoteStream}
                peerId={peerId}
                isMuted={isMuted}
                onAudioElement={onAudioElement}
              />
              <VideoElement
                stream={connection.remoteStream}
                peerId={peerId}
                isMuted={isMuted}
                onVideoElement={onVideoElement}
              />
              <div className="absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded text-white text-xs">
                {peerId.split('-')[1]}
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
};