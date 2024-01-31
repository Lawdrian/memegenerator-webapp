import React, { useEffect, useState } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { Grid } from '@mui/material';

import SpeakText from './SpeakText';

//Redux
import { useSelector, useDispatch } from 'react-redux';
import { setDictation } from '../../slices/dictationSlice';

export default function SpeechRecognitionTest() {
  const [currentText, setCurrentText] = useState([null]);

  const dictation = useSelector((state) => state.dictation.command);

  const dispatch = useDispatch();


  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  useEffect(() => {
    if (!listening) {
    handleCommand(transcript);
    }

  }, [transcript, listening]);

  function handleCommand(spokenText) {
    setCurrentText(null); //Muss auf null gesetzt werden, sonst wird bei wiederholten WOrt keien Änderung erkannt und kein Speech durchgeführt
    if (spokenText.includes('stop')) {
      setCurrentText("Stopp");
      SpeechRecognition.stopListening();
    }
    if (spokenText.includes('Home')) {
      window.history.pushState({}, null, "/");
      setCurrentText("Weiterleitung zur Startseite");
    } 
    if (spokenText.includes('Editor')) {
      window.history.pushState({}, null, "/Editor");
      setCurrentText("Weiterleitung zur Editor");
    }
    if (spokenText.includes("Test")){
      setCurrentText("Test erfolgreich");
    }
    if (spokenText.includes("Ball")){
      setCurrentText("Ball erfolgreich");
    }
    if (spokenText.length>=1){
      setCurrentText("Befehl nicht erkannt: " + spokenText);
    }
    dispatch(setDictation({ spokenText: spokenText }));
    console.log(dictation);
   }


  return (
    <Grid style = {{background: "#A0A0A0", padding: 20}}>
      <p>Microphone: {listening ? 'on' : 'off'}</p>
      <button onClick={() => SpeechRecognition.startListening({ language: 'de-DE' })}>Start</button>
      <button onClick={SpeechRecognition.stopListening}>Stop</button>
      <button onClick={resetTranscript}>Reset</button>
      <p>{transcript}</p>
      <SpeakText text={currentText} />
    </Grid>
  );
}
