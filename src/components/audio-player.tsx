'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Loader2, PlayCircle, StopCircle } from 'lucide-react';
import { getArticleAudioAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';

export default function AudioPlayer({ articleId }: { articleId: string }) {
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const { toast } = useToast();

  const handleFetchAudio = async () => {
    if (audioSrc) {
        // If we already have the audio, just play/pause
        const audio = document.getElementById('article-audio-player') as HTMLAudioElement;
        if (audio) {
            if (isPlaying) {
                audio.pause();
                setIsPlaying(false);
            } else {
                audio.play();
                setIsPlaying(true);
            }
        }
        return;
    }

    setIsLoading(true);
    try {
      const src = await getArticleAudioAction(articleId);
      setAudioSrc(src);
    } catch (error) {
      console.error('Failed to generate audio:', error);
      toast({
        variant: 'destructive',
        title: 'অডিও তৈরি করা যায়নি',
        description: 'অডিও তৈরি করতে একটি সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlay = () => {
    setIsPlaying(true);
  }

  const handlePause = () => {
    setIsPlaying(false);
  }

  return (
    <div className="mt-4">
      {!audioSrc && (
         <Button onClick={handleFetchAudio} disabled={isLoading} variant="outline" size="sm">
            {isLoading ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    অডিও জেনারেট হচ্ছে...
                </>
            ) : (
                <>
                    <PlayCircle className="mr-2 h-4 w-4" />
                    লেখাটি শুনুন
                </>
            )}
        </Button>
      )}

      {audioSrc && (
        <div>
            <audio 
                id="article-audio-player" 
                src={audioSrc} 
                controls 
                autoPlay
                onPlay={handlePlay}
                onPause={handlePause}
                onEnded={handlePause}
                className="w-full"
            >
                Your browser does not support the audio element.
            </audio>
        </div>
      )}
    </div>
  );
}
