import { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';

import SendIcon from '@mui/icons-material/Send';
import { Button, Grid, TextField } from '@mui/material';

import { convertUrlToBase64 } from "../../../../utils/base64Conversions";
import { emptyUploadTemplate } from "./UploadTemplateDialog";



function ImageUrlTab({ template, setTemplate }) {
  const [inputUrl, setInputUrl] = useState(""); // Setze den Initialwert auf einen leeren String
  
  useEffect(() => {
    setTemplate({...emptyUploadTemplate, name: template.name});
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
                try {
                  const response = await fetch(inputUrl);
                  const contentType = response.headers.get('content-type');
                  if (contentType && contentType.startsWith('image/') && contentType !== 'image/gif') {
                    const blob = await response.blob();
                    const reader = new FileReader();
                    reader.onloadend = function() {
                      const base64data = reader.result;
                      setTemplate({...template, content: base64data, format: 'image'});
                    }
                    reader.readAsDataURL(blob);
                  } else {
                    alert('Only Image URLs are supported for this upload type');
                  }
                } catch (error) {
                  alert('The provided URL does not contain a valid image.');
                }
              }}
            >
              Preview
            </Button>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={9}>
        {template.content && <img src={template.content} style={{maxWidth: '50%', maxHeight: '50%'}} />}
      </Grid>
    </Grid>
  )

}

export default ImageUrlTab;
