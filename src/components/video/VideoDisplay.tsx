import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { VideoOff, Maximize2, PictureInPicture } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface VideoDisplayProps {
  isConnected: boolean;
  isVideoEnabled: boolean;
  networkStatus: 'good' | 'poor' | 'offline';
  username: string;
  videoRef: React.RefObject<HTMLVideoElement>;
  onPictureInPicture: () => void;
  onFullscreen: () => void;
}

export const VideoDisplay = ({
  isConnected,
  isVideoEnabled,
  networkStatus,
  username,
  videoRef,
  onPictureInPicture,
  onFullscreen,
}: VideoDisplayProps) => {
  const { toast } = useToast();
  
  const handlePictureInPictureClick = async () => {
    try {
      await onPictureInPicture();
    } catch (error) {
      toast({
        title: "Picture-in-Picture Failed",
        description: "Please ensure video is playing before entering picture-in-picture mode",
        variant: "destructive",
      });
    }
  };

  if (!isConnected) return null;

  return (
    <div className="relative w-64 h-48 bg-black/10 dark:bg-black/30 rounded-lg overflow-hidden shadow-lg">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={`w-full h-full object-cover ${isVideoEnabled ? '' : 'hidden'}`}
      />
      {!isVideoEnabled && (
        <div className="absolute inset-0 flex items-center justify-center text-foreground">
          <VideoOff className="w-8 h-8" />
        </div>
      )}
      <div className="absolute top-2 left-2">
        <Badge variant={
          networkStatus === 'good' ? 'default' :
          networkStatus === 'poor' ? 'warning' : 'destructive'
        }>
          {networkStatus === 'good' ? 'HD' :
           networkStatus === 'poor' ? 'SD' : 'Offline'}
        </Badge>
      </div>
      <div className="absolute bottom-2 left-2 text-xs text-white bg-black/50 px-2 py-1 rounded">
        {username}
      </div>
      <div className="absolute top-2 right-2 flex gap-1">
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 bg-black/20 hover:bg-black/40"
          onClick={handlePictureInPictureClick}
        >
          <PictureInPicture className="h-4 w-4 text-white" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 bg-black/20 hover:bg-black/40"
          onClick={onFullscreen}
        >
          <Maximize2 className="h-4 w-4 text-white" />
        </Button>
      </div>
    </div>
  );
};