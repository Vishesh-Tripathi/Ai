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
