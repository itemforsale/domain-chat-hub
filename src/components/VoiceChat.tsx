import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Video, VideoOff, Volume2, VolumeX, Users } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import Peer from 'peerjs';
import type { MediaConnection } from 'peerjs';
import { useMediaStream } from '@/hooks/useMediaStream';
import { PeerConnections } from './PeerConnections';

interface VoiceChatProps {
  username: string;
}

export const VoiceChat = ({ username }: VoiceChatProps) => {
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

  const handleToggleConnection = async () => {
    try {
      if (!isConnected) {
        if (mediaError) throw mediaError;
        if (!mediaStream) throw new Error('No media stream available');

        // Initialize PeerJS
        peer.current = new Peer(`user-${username}-${Math.random().toString(36).substr(2, 9)}`);
        
        peer.current.on('open', (id) => {
          console.log('My peer ID is: ' + id);
          setConnectedUsers(prev => [...prev, username]);
          
          // Handle incoming calls
          peer.current?.on('call', async (call) => {
            call.answer(mediaStream);
            
            call.on('stream', (remoteStream) => {
              peers.current.set(call.peer, call);
            });
          });
        });

        setIsConnected(true);
        toast({
          title: "Connected to chat",
          description: "You can now speak and share video in the chat",
        });
      } else {
        // Cleanup
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
        
        setConnectedUsers(prev => prev.filter(user => user !== username));
        setIsConnected(false);
        
        toast({
          title: "Disconnected from chat",
          description: "Chat connection ended",
          variant: "destructive",
        });
      }
    } catch (error) {
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

  return (
    <div className="space-y-4">
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

      {isConnected && (
        <PeerConnections
          peers={peers.current}
          isMuted={isMuted}
          onAudioElement={handleAudioElement}
          onVideoElement={handleVideoElement}
        />
      )}
    </div>
  );
};