import React, { useEffect } from 'react';

export default function SpeakText({ text }) {
  useEffect(() => {
    if (text === null) { 
      return; 
    }
    const speech = window.speechSynthesis;

    const speak = (voice) => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = voice;
      utterance.volume = 1;
      utterance.rate = 0.65;
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    };

    if ('speechSynthesis' in window && 'SpeechSynthesisUtterance' in window) {
      const speech = window.speechSynthesis;
      if (speech.getVoices().length === 0) {
        speech.onvoiceschanged = function() {
          speak(speech.getVoices()[3]);
        };
      } else {
        speak(speech.getVoices()[3]);
      }
    } else {
      console.error('Speech synthesis not supported');
    }
  }, [text]);

  return null; // Da diese Komponente keine sichtbare Ausgabe hat
}
