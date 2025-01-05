import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Video, VideoOff, Volume2, VolumeX, Users } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import Peer from 'peerjs';
import type { MediaConnection } from 'peerjs';
import { useMediaStream } from '@/hooks/useMediaStream';
import { PeerConnections } from './PeerConnections';
import { VideoElement } from './VideoElement';

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

  // Clean up function to handle disconnection
  const cleanupConnections = () => {
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

  // Handle incoming calls
  const handleIncomingCall = (call: MediaConnection) => {
    if (!mediaStream) return;
    
    call.answer(mediaStream);
    
    call.on('stream', (remoteStream) => {
      console.log('Received remote stream from:', call.peer);
      peers.current.set(call.peer, call);
    });

    call.on('close', () => {
      console.log('Call closed with:', call.peer);
      peers.current.delete(call.peer);
      updateConnectedUsers(connectedUsers.filter(id => id !== call.peer));
    });
  };

  const handleToggleConnection = async () => {
    try {
      if (!isConnected) {
        if (mediaError) throw mediaError;
        if (!mediaStream) throw new Error('No media stream available');

        // Create a new peer with a unique ID
        const peerId = `user-${username}-${Math.random().toString(36).substr(2, 9)}`;
        peer.current = new Peer(peerId);
        
        peer.current.on('open', (id) => {
          console.log('My peer ID is:', id);
          updateConnectedUsers([...connectedUsers, username]);
          
          // Handle incoming calls
          peer.current?.on('call', handleIncomingCall);
        });

        // Handle errors
        peer.current.on('error', (err) => {
          console.error('PeerJS error:', err);
          toast({
            title: "Connection error",
            description: err.message,
            variant: "destructive",
          });
          cleanupConnections();
        });

        setIsConnected(true);
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
      mediaStream.getAudioTracks().forEach(track => {
        track.enabled = isMuted;
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

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupConnections();
    };
  }, []);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 px-4 py-2 bg-secondary/50 backdrop-blur rounded-full shadow-sm">
        <Button
          size="icon"
          variant={isConnected ? "default" : "secondary"}
          onClick={handleToggleConnection}
        >
          {isConnected ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
        </Button>
        
        <Button
          size="icon"
          variant="ghost"
          onClick={handleToggleMute}
          disabled={!isConnected}
        >
          {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </Button>

        <Button
          size="icon"
          variant="ghost"
          onClick={handleToggleVideo}
          disabled={!isConnected}
        >
          {isVideoEnabled ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
        </Button>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>{connectedUsers.length} connected</span>
        </div>
      </div>

      {isConnected && mediaStream && (
        <div className="space-y-2">
          <div className="relative w-48 aspect-video bg-secondary rounded-lg overflow-hidden shadow-lg fixed bottom-4 right-4 z-50">
            <VideoElement
              stream={mediaStream}
              peerId={peer.current?.id || 'local'}
              isMuted={true}
              onVideoElement={handleVideoElement}
            />
            <div className="absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded text-white text-xs">
              You (Preview)
            </div>
          </div>

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