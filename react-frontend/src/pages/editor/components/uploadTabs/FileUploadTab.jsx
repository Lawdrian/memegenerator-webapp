import { useEffect, useState } from "react";
import SendIcon from '@mui/icons-material/Send';
import { Button, Grid } from '@mui/material';
import { convertToBase64 } from "../../../../utils/base64Conversions";
import { emptyUploadTemplate } from "./UploadTemplateDialog";

function FileUploadTab({ template, setTemplate }) {

  useEffect(() => {
    setTemplate({...emptyUploadTemplate, name: template.name});
  }, []);

  // map the MIME Type to a file format used by the backend
  const mapFileFormat = (mimeType) => {
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
        throw new Error('Unsupported file format');
    }
  }

  // this function transforms the first frame of a video or gif into a base64 string
  const captureFirstFrame = async (file) => {
    console.log("captureFirstFrame");
  
    return new Promise((resolve) => {
      const isGIF = file.type === "image/gif";
      const element = isGIF ? document.createElement("img") : document.createElement("video");
  
      element.crossOrigin = "anonymous"; // Enable cross-origin resource sharing
  
      if (isGIF) {
        element.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = element.width;
          canvas.height = element.height;
  
          const ctx = canvas.getContext("2d");
  
          // Draw the first frame onto the canvas
          ctx.drawImage(element, 0, 0, canvas.width, canvas.height);
  
          const base64 = canvas.toDataURL("image/png");
          resolve(base64);
        };
      } else {
        element.onloadeddata = async () => {
          const canvas = document.createElement("canvas");
          canvas.width = element.videoWidth;
          canvas.height = element.videoHeight;
  
          const ctx = canvas.getContext("2d");
  
          // Set the video current time to 0 to ensure the first frame is captured
          element.currentTime = 0;
  
          // Wait for the video to update its frame
          await new Promise((resolve) => element.onseeked = resolve);
  
          // Draw the video frame onto the canvas
          ctx.drawImage(element, 0, 0, canvas.width, canvas.height);
  
          const base64 = canvas.toDataURL("image/png");
          resolve(base64);
        };
      }
  
      const reader = new FileReader();
      reader.onload = (e) => {
        element.src = e.target.result;
      };
  
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];

    if (file) {
      let base64;
      if (file.type.startsWith('image/gif') || file.type.startsWith('video/')) {
        console.log("video or gif")
        // for videos or other types, capture the first frame
        base64 = await captureFirstFrame(file);
      } else {
        // if it's an image, use convertToBase64 directly
        base64 = await convertToBase64(file);
      }
      setTemplate({
        ...template,
        content: base64,
        format: "image" // for now, only images are supported mapFileFormat(file.type),
      });
    }
  };

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
              accept="image/*,video/*, gif/*"
              type="file"
              hidden
              onChange={handleFileChange}
            />
          </Button>
          <Button onClick={() => console.log(template)}>Log Template</Button>
      </Grid>
      <Grid item xs={9}>
        <img src={template.content} style={{maxWidth: '50%', maxHeight: '50%'}} />
      </Grid>
    </Grid>
  )

}

export default FileUploadTab;
