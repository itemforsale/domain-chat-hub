import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Volume2, VolumeX, Users } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import Peer from 'peerjs';
import type { MediaConnection } from 'peerjs';
import { setupAudioContext, setupMediaStream, setMicrophoneState, setAudioElementsVolume } from '../utils/audioUtils';
import { AudioElement } from './AudioElement';

interface VoiceChatProps {
  username: string;
}

export const VoiceChat = ({ username }: VoiceChatProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [connectedUsers, setConnectedUsers] = useState<string[]>([]);
  const { toast } = useToast();
  
  const audioContext = useRef<AudioContext | null>(null);
  const mediaStream = useRef<MediaStream | null>(null);
  const peer = useRef<Peer | null>(null);
  const peers = useRef<Map<string, MediaConnection>>(new Map());
  const audioElements = useRef<Map<string, HTMLAudioElement>>(new Map());

  const handleToggleVoice = async () => {
    try {
      if (!isConnected) {
        audioContext.current = await setupAudioContext();
        mediaStream.current = await setupMediaStream();

        // Initialize PeerJS
        peer.current = new Peer(`user-${username}-${Math.random().toString(36).substr(2, 9)}`);
        
        peer.current.on('open', (id) => {
          console.log('My peer ID is: ' + id);
          setConnectedUsers(prev => [...prev, username]);
          
          // Handle incoming calls
          peer.current?.on('call', async (call) => {
            call.answer(mediaStream.current!);
            
            call.on('stream', (remoteStream) => {
              if (!audioElements.current.has(call.peer)) {
                const audio = new Audio();
                audio.srcObject = remoteStream;
                audio.autoplay = true;
                audio.volume = isMuted ? 0 : 1;
                
                audio.addEventListener('canplaythrough', () => {
                  audio.play().catch(console.error);
                });
                
                audioElements.current.set(call.peer, audio);
              }
            });
            
            peers.current.set(call.peer, call);
          });
        });

        // Set initial microphone state
        if (mediaStream.current) {
          setMicrophoneState(mediaStream.current, !isMuted);
        }

        setIsConnected(true);
        toast({
          title: "Voice chat connected",
          description: "You can now speak in the voice chat",
        });
      } else {
        // Cleanup code
        peers.current.forEach((connection) => {
          connection.close();
        });
        peers.current.clear();
        
        // Stop all audio playback
        audioElements.current.forEach((audio) => {
          audio.pause();
          audio.srcObject = null;
        });
        audioElements.current.clear();

        if (mediaStream.current) {
          mediaStream.current.getTracks().forEach(track => track.stop());
          mediaStream.current = null;
        }
        
        if (audioContext.current) {
          await audioContext.current.close();
          audioContext.current = null;
        }

        if (peer.current) {
          peer.current.destroy();
          peer.current = null;
        }
        
        setConnectedUsers(prev => prev.filter(user => user !== username));
        setIsConnected(false);
        
        toast({
          title: "Voice chat disconnected",
          description: "Voice chat connection ended",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Voice chat error",
        description: error instanceof Error ? error.message : "Failed to connect to voice chat",
        variant: "destructive",
      });
    }
  };

  const handleToggleMute = async () => {
    if (isConnected && mediaStream.current) {
      // Toggle microphone state
      setMicrophoneState(mediaStream.current, isMuted);
      
      // Toggle volume for remote audio
      setAudioElementsVolume(audioElements.current, isMuted ? 1 : 0);
      
      setIsMuted(!isMuted);
      
      toast({
        title: isMuted ? "Unmuted" : "Muted",
        description: isMuted ? "Voice chat unmuted" : "Voice chat muted",
      });
    }
  };

  const connectToPeer = (peerId: string) => {
    if (mediaStream.current && peer.current) {
      const call = peer.current.call(peerId, mediaStream.current);
      
      call.on('stream', (remoteStream) => {
        const audio = new Audio();
        audio.srcObject = remoteStream;
        audio.play().catch(console.error);
        audioElements.current.set(peerId, audio);
      });
      
      peers.current.set(peerId, call);
    }
  };

  useEffect(() => {
    return () => {
      peers.current.forEach((connection) => {
        connection.close();
      });
      
      audioElements.current.forEach((audio) => {
        audio.pause();
        audio.srcObject = null;
      });
      
      if (mediaStream.current) {
        mediaStream.current.getTracks().forEach(track => track.stop());
      }
      
      if (audioContext.current) {
        audioContext.current.close();
      }
      
      if (peer.current) {
        peer.current.destroy();
      }
      
      setConnectedUsers(prev => prev.filter(user => user !== username));
    };
  }, [username]);

  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-secondary/50 backdrop-blur rounded-full shadow-sm">
      <Button
        size="icon"
        variant={isConnected ? "default" : "secondary"}
        onClick={handleToggleVoice}
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

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Users className="h-4 w-4" />
        <span>{connectedUsers.length} connected</span>
      </div>
    </div>
  );
};
