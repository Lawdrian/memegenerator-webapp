import { useEffect, useState } from "react";
import SendIcon from '@mui/icons-material/Send';
import { Button, Grid } from '@mui/material';
import { convertToBase64 as convertToBase64 } from "../../../../api/templates";
import { emptyUploadTemplate } from "./UploadTemplateDialog";

function FileUploadTab({ template, setTemplate }) {

  useEffect(() => {
    setTemplate(emptyUploadTemplate);
  }, []);

  // map the MIME Type to a file type used by the backend
  const mapFileType = (mimeType) => {
    switch (mimeType) {
      case 'image/jpeg':
        return 'image';
      case 'image/png':
        return 'image';
      case 'image/gif':
        return 'gif';
      case 'video/mp4':
        return 'video';
      default:
        throw new Error('Unsupported file type');
    }
  }

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
              accept="image/*,video/*"
              type="file"
              hidden
              onChange={async (e) => {
                const base64 = await convertToBase64(e.target.files[0]);
                setTemplate({...template, content: base64, type: mapFileType(e.target.files[0].type)});
              }}
            />
          </Button>
          <Button onClick={() => console.log(template)}>Log Template</Button>
      </Grid>
      <Grid item xs={9}>
        {template.content && (template.type == 'video' ? 
          <video src={template.content} style={{maxWidth: '50%', maxHeight: '50%'}} controls /> :
          <img src={template.content} style={{maxWidth: '50%', maxHeight: '50%'}} />
        )}  
      </Grid>
    </Grid>
  )

}

export default FileUploadTab;
