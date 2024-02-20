import React, { useEffect, useState } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { Grid, Popover, Button, Typography } from '@mui/material';
import $ from 'jquery';


import SpeakText from './SpeakText';

import speechToText from './Icon_speechToText.svg';
import Icon from '@mui/material/Icon';
//Redux
import { useSelector, useDispatch } from 'react-redux';
import { setDictation } from '../../slices/dictationSlice';

import './accessibilityContent.css';

export default function SpeechRecognitionTest() {
  const [currentText, setCurrentText] = useState([null]);
  const [showTextDictation, setTextDictation] = useState(false);

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
    else if (spokenText.includes('Home')) {
      window.location.href = "/"; //unsmooth -> lädt neu!
      setCurrentText("Weiterleitung zur Startseite");
    }
    else if (spokenText.includes('Editor')) {
      setCurrentText("Weiterleitung zur Editor");
      window.location.href = "/editor"; //unsmooth -> lädt neu!
    }
    else if (spokenText.includes('Canvas')) {
      window.location.href = "/Canvas"; //unsmooth -> lädt neu!
      setCurrentText("Weiterleitung zur Canvas");
    }
    else if (spokenText.includes('Account')) {
      window.history.pushState({}, null, "/Account");
      setCurrentText("Weiterleitung zur Account");
    }
    //INPUT
    else if (spokenText.includes("Titel")) {
      const index = spokenText.indexOf("Titel");
      const extractedTitel = spokenText.substring(index + "Titel".length).trim();
      $('#memetitel').val(extractedTitel);
      console.log(extractedTitel);
      console.log($('#memetitel'));
    }

    //BTN
    else if (spokenText.includes("Textfeld")) {
      const addFbtn = $('#addTextFieldbtn');
      addFbtn.trigger("click");
    }
    else if (spokenText.includes("Löschen")) {
      const clearBtnElement = $('#clearBtn');
      clearBtnElement.trigger("click");
    }
    else if (spokenText.includes("Abmelden")) {
      const logoutbtn = $('#logOutBtn');
      logoutbtn.trigger("click");
    }
    else if (spokenText.includes("Anmelden")) {
      const logoutbtn = $('#loginBtn');
      logoutbtn.trigger("click");
    }
    else if (spokenText.includes("Vorlesen")) {
      const logoutbtn = $('#vorlesen');
      logoutbtn.trigger("click");
      console.log("vorlesen");
    }
    else if (spokenText.length > 4) {
      setCurrentText("Befehl nicht erkannt: " + spokenText);
    }
    dispatch(setDictation({ spokenText: spokenText }));
    spokenText = null;
  }


  return (
    <Grid container direction="column" alignItems="center">
      <Icon style={{ filter: 'invert(100%)', backgroundImage: `url(${speechToText})`, backgroundSize: 'cover', width: 25, height: 25 }} onClick={() => { showTextDictation ? setTextDictation(false) : setTextDictation(true) }} />
      <Button color="inherit" style={{ fontSize: "12px" }} onClick={() => { showTextDictation ? setTextDictation(false) : setTextDictation(true) }}>Text Dictation</Button>
      {showTextDictation &&
        (<Popover
          open={showTextDictation}
          onClose={() => setTextDictation(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Grid className='popover-textDictation' container justifyContent={"center"} flexDirection={"column"}>
            <Grid container justifyContent={"center"}>
            <Typography variant="subtitle1" gutterBottom> Microphone: {listening ? 'on' : 'off'}</Typography>
            </Grid>
            <Grid>
              <Button onClick={() => SpeechRecognition.startListening({ language: 'de-DE' })}>Start</Button>
              <Button onClick={SpeechRecognition.stopListening}>Stop</Button>
              <Button onClick={resetTranscript}>Reset</Button>
              <p>{transcript}</p>
            </Grid>
            <Grid>
              <SpeakText text={currentText} />
            </Grid>

          </Grid>
        </Popover>
        )
      }
    </Grid>
  );
}
