
import React, { useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { extractYoutubeVideoId, isValidYoutubeUrl } from '@/utils/youtubeUtils';
import VideoPlayer from '@/components/VideoPlayer';
import ClipControls from '@/components/ClipControls';
import ClipsList, { Clip } from '@/components/ClipsList';
import { YoutubeIcon } from 'lucide-react';

const Index = () => {
  const [url, setUrl] = useState<string>('');
  const [videoId, setVideoId] = useState<string | null>(null);
  const [player, setPlayer] = useState<any>(null);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [clips, setClips] = useState<Clip[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Handle URL input and validation
  const handleLoadVideo = () => {
    if (!url.trim()) {
      toast.error('Please enter a YouTube URL');
      return;
    }

    if (!isValidYoutubeUrl(url)) {
      toast.error('Invalid YouTube URL format');
      return;
    }

    setIsLoading(true);
    const id = extractYoutubeVideoId(url);
    
    if (id) {
      setVideoId(id);
      setClips([]);
    } else {
      toast.error('Could not extract video ID from the URL');
    }
  };

  // Handle player ready event
  const handlePlayerReady = (ytPlayer: any) => {
    setPlayer(ytPlayer);
    setIsPlayerReady(true);
    setIsLoading(false);
    toast.success('Video loaded successfully');
  };

  // Add a new clip
  const handleAddClip = (startTime: number, endTime: number) => {
    const newClip: Clip = {
      id: crypto.randomUUID(),
      startTime,
      endTime
    };
    
    setClips(prevClips => [...prevClips, newClip]);
    toast.success('Clip added successfully');
  };

  // Delete a clip
  const handleDeleteClip = (id: string) => {
    setClips(prevClips => prevClips.filter(clip => clip.id !== id));
    toast.success('Clip removed');
  };

  // Submit all clips to a web service
  const handleSubmitClips = async () => {
    if (clips.length === 0) {
      toast.error('No clips to submit');
      return;
    }

    toast.success('Clips ready to submit to web service', {
      description: 'This would normally send data to your backend',
      action: {
        label: 'View Data',
        onClick: () => {
          console.log({
            videoId,
            clips: clips.map(({id, ...clipData}) => clipData)
          });
        }
      }
    });

    // In a real application, you would submit to your backend here
    /*
    try {
      const response = await fetch('your-api-endpoint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          videoId,
          clips: clips.map(({id, ...clipData}) => clipData)
        })
      });
      
      if (response.ok) {
        toast.success('Clips submitted successfully');
      } else {
        toast.error('Failed to submit clips');
      }
    } catch (error) {
      toast.error('Error submitting clips');
      console.error(error);
    }
    */
  };

  // Handle pressing Enter in the URL input
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLoadVideo();
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-10 md:py-16 max-w-5xl mx-auto">
      <div className="w-full max-w-4xl animate-fade-in">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-display font-bold tracking-tight mb-2">YouTube Clip Tracker</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Create and track clips from YouTube videos with precise timestamps
          </p>
        </header>

        <Card className="mb-8 bg-card/60 backdrop-blur-sm border">
          <CardContent className="p-6">
            <div className="flex gap-3">
              <div className="flex-1">
                <Input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Paste YouTube URL..."
                  className="h-11"
                  onKeyDown={handleKeyDown}
                />
              </div>
              <Button 
                onClick={handleLoadVideo} 
                className="h-11 gap-2"
                disabled={isLoading}
              >
                <YoutubeIcon className="h-4 w-4" />
                {isLoading ? 'Loading...' : 'Load Video'}
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-5 gap-8">
          <div className="md:col-span-3">
            <VideoPlayer 
              videoId={videoId} 
              onPlayerReady={handlePlayerReady} 
            />
            
            {videoId && (
              <ClipControls 
                player={player} 
                isPlayerReady={isPlayerReady} 
                onAddClip={handleAddClip} 
              />
            )}
          </div>
          
          <div className="md:col-span-2">
            <ClipsList 
              clips={clips}
              onDeleteClip={handleDeleteClip}
              onSubmitClips={handleSubmitClips}
              player={player}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
