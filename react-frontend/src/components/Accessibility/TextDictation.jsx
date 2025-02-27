import React, { useEffect, useState } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { Grid, Popover, Button, Typography } from '@mui/material';
import $ from 'jquery';
import { useNavigate } from 'react-router-dom';

import SpeakText from './SpeakText';
import { resetDictation, selectCaption, setCaption, setDescription, setName } from '../../slices/dictationSlice';

import speechToText from './Icon_speechToText.svg';
import Icon from '@mui/material/Icon';
//Redux
import { useDispatch } from 'react-redux';
import { setDictation } from '../../slices/dictationSlice';

export default function TextDictation() {
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
    else if (spokenText.includes("upload")){
      $('#uploadTemplateBtn').trigger("click")
    }
    else if (spokenText.includes("statistic")){
      $('#templateStatisticsBtn').trigger("click")
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
      dispatch(setName({ spokenText: extractedTitel }));
    }

    // meme/canvas description
    else if (spokenText.includes("description")){
      console.error("spokenText: ", spokenText)
      const index = spokenText.indexOf("description");
      const extractedTitel = spokenText.substring(index + "description".length).trim();
      //$('#memetitel').val(extractedTitel);
      dispatch(setDescription({ spokenText: extractedTitel }));
    }

    // meme textfield value
    else if (spokenText.includes("caption")){
      const ordinals = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth']; // extend this as needed
      let index = -1;
      for (let i = 0; i < ordinals.length; i++) {
        if (spokenText.includes(ordinals[i])) {
          index = i; // 0-based index
          break;
        }
      }
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
    setCurrentText([null]);
    dispatch(resetDictation());
  }

  return (
    <Grid title = "Dictation" container direction="column" alignItems="center" onClick={() => { !showTextDictation && setTextDictation(true) }}>
      <Icon title = "Dictation" style={{ filter: showTextDictation ? 'invert(0%)': 'invert(100%)', backgroundImage: `url(${speechToText})`, backgroundSize: 'cover', width: 25, height: 25 }}  />
      {/* <Button color="inherit" style={{ fontSize: "12px" }} onClick={() => { showTextDictation ? setTextDictation(false) : setTextDictation(true) }}>Dictation</Button> */}
      {showTextDictation &&
        (<Popover
          open={showTextDictation}
          onClose={() => handleClose()}
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
