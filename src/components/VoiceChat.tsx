import React, { useState, useRef, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import Peer, { MediaConnection } from 'peerjs';  // Changed to import Peer directly
import { useMediaStream } from '@/hooks/useMediaStream';
import { createPeer, setupPeerCallHandling } from '@/utils/peerUtils';
import { VoiceChatControls } from './VoiceChatControls';
import { LocalVideoPreview } from './LocalVideoPreview';
import { PeerConnections } from './PeerConnections';

interface VoiceChatProps {
  username: string;
  onConnectedUsersChange?: (count: number) => void;
}

export const VoiceChat = ({ username, onConnectedUsersChange }: VoiceChatProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(false);
  const [connectedUsers, setConnectedUsers] = useState<string[]>([]);
  const { toast } = useToast();
  
  const { stream: mediaStream, error: mediaError } = useMediaStream(isVideoEnabled);
  const peer = useRef<Peer | null>(null);
  const peers = useRef<Map<string, MediaConnection>>(new Map());
  const audioElements = useRef<Map<string, HTMLAudioElement>>(new Map());
  const videoElements = useRef<Map<string, HTMLVideoElement>>(new Map());

  const updateConnectedUsers = (users: string[]) => {
    setConnectedUsers(users);
    onConnectedUsersChange?.(users.length);
  };

  const cleanupConnections = () => {
    console.log('Cleaning up connections');
    peers.current.forEach((connection) => {
      connection.close();
    });
    peers.current.clear();
    audioElements.current.clear();
    videoElements.current.clear();

    if (peer.current) {
      peer.current.destroy();
      peer.current = null;
    }
    
    updateConnectedUsers(connectedUsers.filter(user => user !== username));
    setIsConnected(false);
  };

  const handleToggleConnection = async () => {
    try {
      if (!isConnected) {
        if (mediaError) throw mediaError;
        if (!mediaStream) throw new Error('No media stream available');

        console.log('Initializing media stream:', mediaStream.getTracks());
        console.log('Audio tracks:', mediaStream.getAudioTracks());

        const newPeer = await createPeer(username);
        peer.current = newPeer;

        setupPeerCallHandling(
          newPeer,
          mediaStream,
          (peerId, connection) => {
            console.log('New peer connected:', peerId);
            peers.current.set(peerId, connection);
            updateConnectedUsers([...connectedUsers, peerId]);
          },
          (peerId) => {
            console.log('Peer disconnected:', peerId);
            peers.current.delete(peerId);
            updateConnectedUsers(connectedUsers.filter(id => id !== peerId));
          }
        );

        setIsConnected(true);
        updateConnectedUsers([...connectedUsers, username]);
        
        toast({
          title: "Connected to chat",
          description: "You can now speak and share video in the chat",
        });
      } else {
        cleanupConnections();
        toast({
          title: "Disconnected from chat",
          description: "Chat connection ended",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Connection error:', error);
      toast({
        title: "Chat error",
        description: error instanceof Error ? error.message : "Failed to connect to chat",
        variant: "destructive",
      });
    }
  };

  const handleToggleMute = () => {
    if (mediaStream) {
      console.log('Toggling mute state:', !isMuted);
      const audioTracks = mediaStream.getAudioTracks();
      
      audioTracks.forEach(track => {
        track.enabled = isMuted;
        console.log('Audio track state after toggle:', {
          enabled: track.enabled,
          muted: track.muted,
          readyState: track.readyState
        });
      });
      
      setIsMuted(!isMuted);
      
      toast({
        title: isMuted ? "Unmuted" : "Muted",
        description: isMuted ? "Chat unmuted" : "Chat muted",
      });
    }
  };

  const handleToggleVideo = () => {
    setIsVideoEnabled(!isVideoEnabled);
  };

  const handleAudioElement = (peerId: string, audio: HTMLAudioElement) => {
    audioElements.current.set(peerId, audio);
  };

  const handleVideoElement = (peerId: string, video: HTMLVideoElement) => {
    videoElements.current.set(peerId, video);
  };

  useEffect(() => {
    return () => {
      cleanupConnections();
    };
  }, []);

  return (
    <div className="space-y-2">
      <VoiceChatControls
        isConnected={isConnected}
        isMuted={isMuted}
        isVideoEnabled={isVideoEnabled}
        connectedCount={connectedUsers.length}
        onToggleConnection={handleToggleConnection}
        onToggleMute={handleToggleMute}
        onToggleVideo={handleToggleVideo}
      />

      {isConnected && mediaStream && (
        <div className="space-y-2">
          <LocalVideoPreview
            stream={mediaStream}
            peerId={peer.current?.id || 'local'}
            onVideoElement={handleVideoElement}
          />

          <div className="w-full">
            <PeerConnections
              peers={peers.current}
              isMuted={isMuted}
              onAudioElement={handleAudioElement}
              onVideoElement={handleVideoElement}
            />
          </div>
        </div>
      )}
    </div>
  );
};