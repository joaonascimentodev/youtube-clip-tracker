
import React from 'react';
import { Button } from '@/components/ui/button';
import { formatTime } from '@/utils/youtubeUtils';
import { Scissors, Play, PauseIcon, Check } from 'lucide-react';

interface ClipControlsProps {
  player: any;
  isPlayerReady: boolean;
  onAddClip: (startTime: number, endTime: number) => void;
}

const ClipControls: React.FC<ClipControlsProps> = ({ player, isPlayerReady, onAddClip }) => {
  const [isRecording, setIsRecording] = React.useState(false);
  const [startTime, setStartTime] = React.useState<number | null>(null);
  const [currentTime, setCurrentTime] = React.useState(0);
  const timerRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    if (isPlayerReady && player) {
      // Update current time display
      const updateTime = () => {
        try {
          const time = player.getCurrentTime();
          setCurrentTime(time);
        } catch (e) {
          console.error('Error getting current time:', e);
        }
        timerRef.current = requestAnimationFrame(updateTime);
      };
      
      timerRef.current = requestAnimationFrame(updateTime);
    }
    
    return () => {
      if (timerRef.current) {
        cancelAnimationFrame(timerRef.current);
      }
    };
  }, [isPlayerReady, player]);

  const handleStartClip = () => {
    if (!player) return;
    
    try {
      const time = player.getCurrentTime();
      setStartTime(time);
      setIsRecording(true);
    } catch (e) {
      console.error('Error starting clip:', e);
    }
  };

  const handleEndClip = () => {
    if (!player || startTime === null) return;
    
    try {
      const endTime = player.getCurrentTime();
      
      // Only add clip if end time is after start time
      if (endTime > startTime) {
        onAddClip(startTime, endTime);
      }
      
      setStartTime(null);
      setIsRecording(false);
    } catch (e) {
      console.error('Error ending clip:', e);
    }
  };

  const handlePlayPause = () => {
    if (!player) return;
    
    try {
      const state = player.getPlayerState();
      if (state === 1) { // playing
        player.pauseVideo();
      } else {
        player.playVideo();
      }
    } catch (e) {
      console.error('Error toggling play state:', e);
    }
  };

  return (
    <div className="clip-controls mt-6 space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="time-display text-xl font-medium tracking-tight">
          {formatTime(currentTime)}
        </div>
        <div className="playback-controls">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handlePlayPause}
            disabled={!isPlayerReady}
            className="focus:outline-none"
          >
            {true ? <Play size={22} /> : <PauseIcon size={22} />}
          </Button>
        </div>
      </div>
      
      <div className="clip-actions flex gap-4">
        {!isRecording ? (
          <Button 
            className="w-full relative overflow-hidden group transition-all duration-300"
            onClick={handleStartClip}
            disabled={!isPlayerReady}
          >
            <span className="flex items-center gap-2">
              <Scissors className="w-4 h-4" />
              Mark Clip Start
            </span>
            <span className="absolute inset-0 w-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left bg-primary/10" />
          </Button>
        ) : (
          <Button 
            variant="destructive"
            className="w-full relative overflow-hidden group transition-all duration-300"
            onClick={handleEndClip}
          >
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4" />
              Mark Clip End
            </span>
            <span className="absolute inset-0 w-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left bg-destructive/10" />
          </Button>
        )}
      </div>
      
      {isRecording && startTime !== null && (
        <div className="recording-indicator flex items-center gap-2 text-sm text-destructive animate-pulse">
          <div className="w-2 h-2 rounded-full bg-destructive"></div>
          Recording clip from {formatTime(startTime)}
        </div>
      )}
    </div>
  );
};

export default ClipControls;
