import { useState, useRef, useCallback } from 'react';

export const useTTS = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const speak = useCallback(async (text: string, model: string = 'playai-tts') => {
    if (!text.trim()) return;

    try {
      setIsLoading(true);
      
      // Stop any currently playing audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }

      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, model }),
      });

      const responseData = await response.json().catch(() => ({}));

      // Check if we need to fallback to browser TTS
      if (response.status === 422 && responseData.fallback) {
        console.log('Using browser TTS fallback');
        // Use browser's built-in speech synthesis
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.rate = 1.0;
        utterance.pitch = 1;
        utterance.volume = 1;

        utterance.onstart = () => setIsPlaying(true);
        utterance.onend = () => setIsPlaying(false);
        utterance.onerror = () => setIsPlaying(false);

        speechSynthesis.speak(utterance);
        return;
      }

      if (!response.ok) {
        console.error('TTS request failed:', response.status, responseData);
        throw new Error(`TTS request failed: ${response.status} - ${responseData.details || 'Unknown error'}`);
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      
      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onplay = () => setIsPlaying(true);
      audio.onended = () => {
        setIsPlaying(false);
        URL.revokeObjectURL(audioUrl);
      };
      audio.onerror = () => {
        setIsPlaying(false);
        URL.revokeObjectURL(audioUrl);
      };

      await audio.play();
      
    } catch (error) {
      console.error('TTS Error:', error);
      
      // Fallback to browser TTS if API fails
      console.log('API failed, using browser TTS fallback');
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 1.0;
      utterance.pitch = 1;
      utterance.volume = 1;

      utterance.onstart = () => setIsPlaying(true);
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);

      speechSynthesis.speak(utterance);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    
    // Also stop browser TTS if it's playing
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }
    
    setIsPlaying(false);
  }, []);

  return { speak, stop, isPlaying, isLoading };
};
