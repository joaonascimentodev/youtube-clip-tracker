
import React from 'react';
import { Button } from '@/components/ui/button';
import { formatTime } from '@/utils/youtubeUtils';
import { Trash2, Clock, Send, List } from 'lucide-react';
import { toast } from 'sonner';

export interface Clip {
  id: string;
  startTime: number;
  endTime: number;
}

interface ClipsListProps {
  clips: Clip[];
  onDeleteClip: (id: string) => void;
  onSubmitClips: () => void;
  player: any;
}

const ClipsList: React.FC<ClipsListProps> = ({ 
  clips, 
  onDeleteClip, 
  onSubmitClips,
  player 
}) => {
  const handlePreviewClip = (startTime: number) => {
    if (player) {
      player.seekTo(startTime, true);
      player.playVideo();
    }
  };

  if (clips.length === 0) {
    return (
      <div className="clips-empty-state mt-8 p-6 border border-dashed rounded-lg bg-muted/30 text-center">
        <List className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
        <h3 className="font-medium text-muted-foreground">No clips yet</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Mark clip start and end times to create clips
        </p>
      </div>
    );
  }

  return (
    <div className="clips-list mt-8 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold tracking-tight">
          Clips <span className="text-muted-foreground">({clips.length})</span>
        </h2>
        
        <Button 
          onClick={onSubmitClips}
          className="gap-1.5"
          disabled={clips.length === 0}
        >
          <Send className="h-4 w-4" />
          Submit Clips
        </Button>
      </div>
      
      <div className="clips-container space-y-2">
        {clips.map((clip) => (
          <div 
            key={clip.id} 
            className="clip-item border rounded-lg p-3 bg-card animate-scale-in flex items-center justify-between group transition-all hover:shadow-sm hover:bg-accent/20"
          >
            <div className="clip-info flex items-center flex-1 min-w-0">
              <Button 
                variant="ghost" 
                size="icon"
                className="h-8 w-8 mr-2 text-muted-foreground"
                onClick={() => handlePreviewClip(clip.startTime)}
              >
                <Clock className="h-4 w-4" />
              </Button>
              
              <div className="clip-times truncate">
                <span className="font-medium">{formatTime(clip.startTime)}</span>
                <span className="text-muted-foreground mx-2">to</span>
                <span className="font-medium">{formatTime(clip.endTime)}</span>
                <span className="text-xs text-muted-foreground ml-2">
                  ({(clip.endTime - clip.startTime).toFixed(1)}s)
                </span>
              </div>
            </div>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => onDeleteClip(clip.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClipsList;
