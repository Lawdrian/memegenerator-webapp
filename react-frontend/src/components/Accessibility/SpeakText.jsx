import { useEffect } from 'react';

export default function SpeakText({ text }) {
  useEffect(() => {
    if (text === null) { 
      return; 
    }
        const speech = window.speechSynthesis;

    const speak = () => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.volume = 1;
      utterance.rate = 0.65;
      speech.speak(utterance);
    };

    if ('speechSynthesis' in window && 'SpeechSynthesisUtterance' in window) {
      speak();
    } else {
      console.error('Speech synthesis not supported');
    }
  }, [text]);

  return null; // Da diese Komponente keine sichtbare Ausgabe hat
}
