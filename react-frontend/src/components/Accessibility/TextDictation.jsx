import React, { useEffect, useState } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { Grid, Popover, Button } from '@mui/material';
import $ from 'jquery';


import SpeakText from './SpeakText';

//Redux
import { useSelector, useDispatch } from 'react-redux';
import { setDictation } from '../../slices/dictationSlice';

export default function SpeechRecognitionTest() {
  const [currentText, setCurrentText] = useState([null]);
  const [showTextDictation, setTextDictation] = useState(false);
  const dictation = useSelector((state) => state.dictation.command);

  const dispatch = useDispatch();


  const {
    transcript,
    listening,
    resetTranscript,
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

    //WEITERLEITUNGEN
    if (spokenText.includes('Home')) {
      window.history.pushState({}, null, "/");
      setCurrentText("Weiterleitung zur Startseite");
    } 
    if (spokenText.includes('Editor')) {
      window.history.pushState({}, null, "/Editor");
      setCurrentText("Weiterleitung zur Editor");
    }
    if(spokenText.includes('Canvas')){
      window.history.pushState({}, null, "/Canvas");
      setCurrentText("Weiterleitung zur Canvas");
    }
    if(spokenText.includes('Account')){
      window.history.pushState({}, null, "/Account");
      setCurrentText("Weiterleitung zur Account");
    }
    //INPUT
    if (spokenText.includes("Titel")){
      const index = spokenText.indexOf("Titel");
      const extractedTitel = spokenText.substring(index + "Titel".length).trim();
      $('#memetitel').val(extractedTitel);
      console.log(extractedTitel);
      console.log($('#memetitel'));
    }

    //BTN
    if (spokenText.includes("Textfeld")){
      const addFbtn = $('#addTextFieldbtn');
      addFbtn.trigger("click");
    }
    if (spokenText.includes("Löschen")){
      const clearBtnElement = $('#clearBtn');
      clearBtnElement.trigger("click");
    }
    if(spokenText.includes("Abmelden")){
      const logoutbtn = $('#logOutBtn');
      logoutbtn.trigger("click");
    }
    if(spokenText.includes("Anmelden")){
      const logoutbtn = $('#loginBtn');
      logoutbtn.trigger("click");
    }
    if(spokenText.includes("Vorlesen")){
      const logoutbtn = $('#vorlesen');
      logoutbtn.trigger("click");
      console.log("vorlesen");
    }

    else if (spokenText.length > 4){
      setCurrentText("Befehl nicht erkannt: " + spokenText);
    }
    dispatch(setDictation({ spokenText: spokenText }));
    console.log(dictation);
   }


  return (
    <Grid style={{ flexGrow: 1 }}>
     <Button variant = "contained" color="warning" onClick={() => { showTextDictation ? setTextDictation(false) : setTextDictation(true) }}>Text Dictation</Button>
      {showTextDictation &&
        (<Popover
          open={showTextDictation}
          onClose={() => setTextDictation(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Grid style={{ background: "#A0A0A0", padding: 20 }}>
            <p>Microphone: {listening ? 'on' : 'off'}</p>
            <button onClick={() => SpeechRecognition.startListening({ language: 'de-DE' })}>Start</button>
            <button onClick={SpeechRecognition.stopListening}>Stop</button>
            <button onClick={resetTranscript}>Reset</button>
            <p>{transcript}</p>
            <SpeakText text={currentText} />
          </Grid>
        </Popover>
        )
      }
    </Grid>
  );
}
