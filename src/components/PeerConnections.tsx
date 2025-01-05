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
    <div className="grid grid-cols-2 gap-4">
      {Array.from(peers.entries()).map(([peerId, connection]) => (
        <div key={peerId} className="relative aspect-video bg-secondary rounded-lg overflow-hidden">
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
            </>
          )}
        </div>
      ))}
    </div>
  );
};