import { useEffect, useState } from "react";
import SendIcon from '@mui/icons-material/Send';
import { Button, Grid } from '@mui/material';
import { convertToBase64 as convertToBase64 } from "../../../../api/templates";

function FileUploadTab({ template, setTemplate }) {

  useEffect(() => {
    setTemplate();
  }, []);

  return (
    <Grid container spacing={2}>
      <Grid item xs={3}>
          <Button
            variant="contained"
            component="label"
            endIcon={<SendIcon />}
          >
            Choose File
            <input
              accept="image/*"
              type="file"
              hidden
              onChange={async (e) => {
                const base64 = await convertToBase64(e.target.files[0]);
                setTemplate(base64);
              }}
            />
          </Button>
      </Grid>
      <Grid item xs={9}>
        {template && <img src={template} style={{maxWidth: '50%', maxHeight: '50%'}} />}
      </Grid>
    </Grid>
  )

}

export default FileUploadTab;
