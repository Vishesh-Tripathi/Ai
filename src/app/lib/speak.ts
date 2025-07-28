// Legacy browser TTS function - kept for compatibility
export function speakText(text: string) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  utterance.rate = 1.0; // You can adjust speed: 0.5 (slow) to 2 (fast)
  utterance.pitch = 1;  // Pitch: 0 (low) to 2 (high)
  utterance.volume = 1; // Volume: 0 to 1

  // Optional: log when speech starts/ends
  utterance.onstart = () => console.log('Speaking...');
  utterance.onend = () => console.log('Done speaking.');

  speechSynthesis.speak(utterance);
}

// Enhanced TTS function using Groq API
export async function speakTextWithGroq(text: string, model: string = 'playai-tts'): Promise<HTMLAudioElement | null> {
  try {
    const response = await fetch('/api/tts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text, model }),
    });

    if (!response.ok) {
      throw new Error('TTS request failed');
    }

    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    
    // Clean up URL after audio ends
    audio.onended = () => URL.revokeObjectURL(audioUrl);
    audio.onerror = () => URL.revokeObjectURL(audioUrl);
    
    await audio.play();
    return audio;
    
  } catch (error) {
    console.error('Enhanced TTS Error:', error);
    // Fallback to browser TTS
    speakText(text);
    return null;
  }
}
