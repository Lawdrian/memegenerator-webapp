import { useEffect, useRef } from "react";
import SendIcon from '@mui/icons-material/Send';
import Button from '@mui/material/Button';

import Webcam from "react-webcam"; // FOR CAMERA FUNCTION: Importiert die Webcam-Komponente
import React from "react";
import { Grid } from "@mui/material";
import { emptyUploadTemplate } from "./UploadTemplateDialog";

function CameraUploadTab({template, setTemplate}) {

  const webcamRef = useRef(null); //FOR CAMERA FUNCTION

  useEffect(() => {
    setTemplate({...emptyUploadTemplate, name: template.name});
  }, []);

  function capture(){
    const imageSrc = webcamRef.current.getScreenshot(); // FOR CAMERA FUNCTION: Holt sich das Bild von der Webcam
    setTemplate({...template, content: imageSrc, format: 'image'}); // Setzt das Bild als state
  }


  return (
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <Grid container spacing={2} direction="column">
          <Grid item>
            <Webcam
                audio={false}
                height={480}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                width={640}
            />
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              endIcon={<SendIcon />}
              onClick={capture}
            >
              Take photo
            </Button>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={6}>
        {template.content && <img src={template.content} style={{maxWidth: '50%', maxHeight: '50%'}} />}
      </Grid>
    </Grid>
    )
}

export default CameraUploadTab;
