import React, { useState } from 'react';
import { Box, Typography, TextField, Divider, InputAdornment } from '@mui/material';

import {ImageEditorButton} from '../components/ImageEditorButton';
import { saveMeme } from '../../../api/meme';
import { useEffect } from 'react';
import { set } from 'mongoose';

import $ from 'jquery';

const ImageEditorFooter = ({handleMemeCreation}) => {

    const [fileSize, setFileSize] = useState(1);
    const [memeName, setMemeName] = useState($('#memetitel').val());

    useEffect(() => {
      const intervalId = setInterval(() => {
        const memetitelElement = $('#memetitel');
        const value = memetitelElement.val();
        setMemeName(value);
        console.log("Wert von #memetitel:", value);
      }, 1000); // Alle 1000 Millisekunden (1 Sekunde) überprüfen
    
      // aufräumen -> das Interval stopp, wenn Komponente entladen 
      return () => clearInterval(intervalId);
    }, []);

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
        id="memetitel" 
        type="text" 
        value={memeName} 
        onChange={(event) => setMemeName(event.target.value)} 
      />
      <Divider orientation="vertical" flexItem />
      <ImageEditorButton id="downloadBtn" onClick={() => handleMemeCreation(fileSize, memeName, true)}>download</ImageEditorButton>
      <ImageEditorButton onClick={() => handleMemeCreation(fileSize, memeName, false, false)}>save public</ImageEditorButton>
      <ImageEditorButton onClick={() => handleMemeCreation(fileSize, memeName, false, true)}>save private</ImageEditorButton>
    </Box>
    )


}

export default ImageEditorFooter;