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
  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      {Array.from(peers.entries()).map(([peerId, connection]) => (
        <div key={peerId} className="relative aspect-video bg-secondary rounded-lg overflow-hidden shadow-lg">
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
              <div className="absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded text-white text-sm">
                {peerId.split('-')[1]} {/* Display username from peer ID */}
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
};