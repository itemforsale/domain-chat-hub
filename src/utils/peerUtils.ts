import type { MediaConnection } from 'peerjs';
import Peer from 'peerjs';

export const createPeer = (username: string): Promise<Peer> => {
  return new Promise((resolve, reject) => {
    const peerId = `user-${username}-${Math.random().toString(36).substr(2, 9)}`;
    const peer = new Peer(peerId);
    
    peer.on('open', () => {
      console.log('My peer ID is:', peerId);
      resolve(peer);
    });

    peer.on('error', (err) => {
      console.error('PeerJS error:', err);
      reject(err);
    });
  });
};

export const setupPeerCallHandling = (
  peer: Peer,
  mediaStream: MediaStream,
  onNewConnection: (peerId: string, connection: MediaConnection) => void,
  onConnectionClosed: (peerId: string) => void
) => {
  peer.on('call', (call) => {
    console.log('Receiving call from:', call.peer);
    call.answer(mediaStream);
    
    call.on('stream', (remoteStream) => {
      console.log('Received remote stream from:', call.peer);
      onNewConnection(call.peer, call);
    });

    call.on('close', () => {
      console.log('Call closed with:', call.peer);
      onConnectionClosed(call.peer);
    });
  });
};