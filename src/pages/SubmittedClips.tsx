
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatTime } from '@/utils/youtubeUtils';
import { Download, ArrowLeft, Clock, Video, Type } from 'lucide-react';
import { toast } from 'sonner';

interface Clip {
  startTime: number;
  endTime: number;
  title: string;
}

interface SubmittedClipsState {
  videoId: string;
  clips: Clip[];
}

const SubmittedClips = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as SubmittedClipsState;

  if (!state || !state.videoId || !state.clips || state.clips.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center px-4 py-10 md:py-16 max-w-5xl mx-auto">
        <Card className="w-full max-w-4xl">
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground mb-4">No clips data found.</p>
            <Button onClick={() => navigate('/')}>Return to Clip Tracker</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleDownload = (clip: Clip) => {
    // In a real application, this would trigger a download of the clip
    // For now, we'll just show a toast message
    toast.success(`Preparing download for "${clip.title || 'Untitled clip'}"`, {
      description: `Time range: ${formatTime(clip.startTime)} - ${formatTime(clip.endTime)}`,
    });
    
    // Demonstration - in a real app this would connect to a backend service
    console.log(`Download requested for clip:`, {
      videoId: state.videoId,
      startTime: clip.startTime,
      endTime: clip.endTime,
      title: clip.title
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-10 md:py-16 max-w-5xl mx-auto">
      <div className="w-full max-w-4xl animate-fade-in">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-display font-bold tracking-tight mb-2">Your Clips Are Ready</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Download your clips or return to create more
          </p>
        </header>

        <div className="flex justify-between items-center mb-4">
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Clip Tracker
          </Button>
          
          <div className="text-sm text-muted-foreground">
            <span className="font-medium">{state.clips.length}</span> clip{state.clips.length !== 1 && 's'} from YouTube video
          </div>
        </div>

        <div className="grid gap-4">
          {state.clips.map((clip, index) => (
            <Card key={index} className="overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Type className="h-5 w-5 text-primary" />
                  {clip.title || 'Untitled clip'}
                </CardTitle>
                <CardDescription className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  {formatTime(clip.startTime)} - {formatTime(clip.endTime)} 
                  <span className="ml-1">({(clip.endTime - clip.startTime).toFixed(1)}s)</span>
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pb-4">
                <div className="aspect-video bg-muted/50 rounded-md flex items-center justify-center">
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <Video className="h-10 w-10 mb-2 opacity-50" />
                    <p className="text-sm">Video preview would appear here</p>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="bg-muted/20 pt-3 pb-3">
                <Button 
                  className="gap-2 w-full sm:w-auto"
                  onClick={() => handleDownload(clip)}
                >
                  <Download className="h-4 w-4" />
                  Download Clip
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubmittedClips;
