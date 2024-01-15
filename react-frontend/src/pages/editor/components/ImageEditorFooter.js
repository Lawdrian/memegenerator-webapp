import React, { useState } from 'react';
import { Box, Typography, TextField, Divider, InputAdornment } from '@mui/material';

import ImageEditorButton from '../components/ImageEditorButton';

const ImageEditorFooter = ({handleDownload}) => {

    const [fileSize, setFileSize] = useState(1);
    const [memeName, setMemeName] = useState("myMeme");

    return(
    <Box display="flex" alignItems="center" sx={{ gap: 2, padding:'10px' }}>
      <Typography>File Size:</Typography>
      <TextField 
        sx={{ width: '150px' }} 
        id="fileSize" 
        type="number" 
        value={fileSize} 
        onChange={(event) => setFileSize(event.target.value)} 
        InputProps={{
          endAdornment: <InputAdornment position="end">mb</InputAdornment>,
        }}
      />
      <Divider orientation="vertical" flexItem />
      <Typography>Meme Name:</Typography>
      <TextField 
        sx={{ width: '200px' }} 
        id="text" 
        type="text" 
        value={memeName} 
        onChange={(event) => setMemeName(event.target.value)} 
      />
      <Divider orientation="vertical" flexItem />
      <ImageEditorButton onClick={() => handleDownload(fileSize)}>download</ImageEditorButton>
      <ImageEditorButton onClick={() => console.log("TODO: SAVE TO SERVER")}>save to profile</ImageEditorButton>
    </Box>
    )


}

export default ImageEditorFooter;