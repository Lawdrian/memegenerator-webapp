import React, { useEffect, useState } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { Grid, Popover, Button } from '@mui/material';
import $ from 'jquery';
import { useNavigate } from 'react-router-dom';

import SpeakText from './SpeakText';

//Redux
import { useSelector, useDispatch } from 'react-redux';
import { setName, setDictation, setCaption, selectCaption, setDescription, resetDictation } from '../../slices/dictationSlice';

export default function SpeechRecognitionTest() {
  const [currentText, setCurrentText] = useState([null]);
  const [showTextDictation, setTextDictation] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    transcript,
    listening,
    resetTranscript,
  } = useSpeechRecognition();

  useEffect(() => {
    if (!listening) {
    handleCommand(transcript.toLowerCase());
    }

  }, [transcript, listening]);

  function handleCommand(spokenText) {

    setCurrentText(null); //Muss auf null gesetzt werden, sonst wird bei wiederholten WOrt keien Änderung erkannt und kein Speech durchgeführt
    if (spokenText.includes('stop')) {
      setCurrentText("Stopp");
      SpeechRecognition.stopListening();
    }

    //WEITERLEITUNGEN
    else if (spokenText.includes('home')) {
      navigate("/");
    } 
    else if (spokenText.includes('editor')) {
      navigate("/Editor");
    }
    else if(spokenText.includes('canvas')){
      navigate("/Canvas");
    }
    else if(spokenText.includes('account')){
      navigate("/Account");
    }

    //BTN

    //editor
    else if (
      spokenText.includes("add caption") || 
      spokenText.includes("at caption")) {
      $('#addTextFieldBtn').trigger("click");
    }
    else if (
      spokenText.includes("delete caption")) {
      $('#deleteTextFieldBtn').trigger("click");
    }
      else if (spokenText.includes("clear")){
      $('#clearBtn').trigger("click");
    }
    else if (spokenText.includes("download")){
      $('#downloadBtn').trigger("click")
    }
    else if (spokenText.includes("save meme") || spokenText.includes("safe meme")){
      $('#saveMemeBtn').trigger("click")
    }
    else if (spokenText.includes("save draft")){
      $('#saveDraftBtn').trigger("click")
    }

    // canvas
    else if (spokenText.includes("upload")){
      $('#uploadCanvasBtn').trigger("click")
    }
    else if (spokenText.includes("upload")){
      $('#uploadCanvasBtn').trigger("click")
    }


    else if(spokenText.includes("logout")){
      const logoutbtn = $('#logOutBtn');
      if(logoutbtn.length > 0){
        logoutbtn.trigger("click");
        setCurrentText("Logout succesful");
      }
    }
    else if(spokenText.includes("login")){
      $('#loginBtn').trigger("click");
    }
    else if(spokenText.includes("read")){
      $('#readContentBtn').trigger("click");
    }

    //INPUT

    // meme/canvas name
    else if (spokenText.includes("name")){
      console.error("spokenText: ", spokenText)
      const index = spokenText.indexOf("name");
      const extractedTitel = spokenText.substring(index + "name".length).trim();
      //$('#memetitel').val(extractedTitel);
      console.log("name: ",extractedTitel);
      dispatch(setName({ spokenText: extractedTitel }));
    }

    // meme/canvas description
    else if (spokenText.includes("description")){
      console.error("spokenText: ", spokenText)
      const index = spokenText.indexOf("description");
      const extractedTitel = spokenText.substring(index + "description".length).trim();
      //$('#memetitel').val(extractedTitel);
      console.log("description: ",extractedTitel);
      dispatch(setDescription({ spokenText: extractedTitel }));
    }

    // meme textfield value
    else if (spokenText.includes("caption")){
      console.log("spokenText: ", spokenText)
      const ordinals = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth']; // extend this as needed
      let index = -1;
      for (let i = 0; i < ordinals.length; i++) {
        console.log("spokenTextincludes: ", spokenText.includes(ordinals[i]))
        if (spokenText.includes(ordinals[i])) {
          index = i; // 0-based index
          break;
        }
      }
      console.log("index: " + index)
      if(index !== -1){
        const textIndex = spokenText.indexOf("caption");
        const extractedText = spokenText.substring(textIndex + "caption".length).trim();
        if(spokenText.includes("select")){
          dispatch(selectCaption({ index: index}))
        }
        else {
          dispatch(setCaption({ index: index, spokenText: extractedText }))
        }
      }
    }
  
    else if (spokenText.length > 4){
      setCurrentText("Could not recognize: " + spokenText);
    }
    dispatch(setDictation({ spokenText: spokenText }));
    spokenText = null;
   }


  const handleClose = () => {
    setTextDictation(false);
    dispatch(resetDictation());
  }

  return (
    <Grid style={{ flexGrow: 1 }}>
     <Button variant = "contained" color="warning" onClick={() => { showTextDictation ? handleClose() : setTextDictation(true) }}>Text Dictation</Button>
      {showTextDictation &&
        (<Popover
          open={showTextDictation}
          onClose={handleClose}
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
