import { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';

import SendIcon from '@mui/icons-material/Send';
import { Button, Grid, TextField } from '@mui/material';

import { convertUrlToBase64 } from "../../../../api/templates";



function ImageUrlTab({ template, setTemplate }) {
  const [inputUrl, setInputUrl] = useState(""); // Setze den Initialwert auf einen leeren String
  
  useEffect(() => {
    setTemplate();
  }, []);

  function handleUrlChange(e) {
    setInputUrl(e.target.value);
  }
  
  return (
    <Grid container spacing={2}>
      <Grid item xs={3}>
        <Grid container spacing={2} direction="column">
          <Grid item>
            <TextField
              type="text"
              value={inputUrl}
              onChange={handleUrlChange}
              placeholder="Bild-URL eingeben"
            />
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              endIcon={<SendIcon />}
              disabled={!inputUrl}
              onClick={async (e) => {
                const base64 = await convertUrlToBase64(inputUrl);
                setTemplate(base64);
              }}
            >
              Preview
            </Button>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={9}>
        {template && <img src={template} style={{maxWidth: '50%', maxHeight: '50%'}} />}
      </Grid>
    </Grid>
  )

}

export default ImageUrlTab;
