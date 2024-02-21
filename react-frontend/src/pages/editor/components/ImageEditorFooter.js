import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Divider, InputAdornment, Radio, FormControlLabel, FormControl, FormLabel, RadioGroup } from '@mui/material';
import $ from 'jquery';

import {ImageEditorButton} from './ImageEditorButton';
import { useSelector } from 'react-redux';

const ImageEditorFooter = ({templateSelected, handleMemeCreation, handleDraftCreation}) => {

    const dictation = useSelector((state) => state.dictation);

    const [fileSize, setFileSize] = useState(1);
    const [memeName, setMemeName] = useState('myMeme'); // initial value from html element with id memetitel
    const [memeDescription, setMemeDescription] = useState("A funny meme");
    const [memePrivacy, setMemePrivacy] = useState("public");

    // this useEffect is used to update the meme name state with the spoken text from the dictation
    useEffect(() => {
      console.log("dictation.name: ", dictation.name);
      console.log(dictation)
      if(dictation.name !== "") {
        setMemeName(dictation.name);
      }
    }, [dictation.name]);

    // this useEffect is used to update the meme description state with the spoken text from the dictation
    useEffect(() => {
      console.log("dictation.description: ", dictation.description);
      if(dictation.description !== "") {
        setMemeDescription(dictation.description);
      }
    }, [dictation]);
    console.log("templateSelected: ", templateSelected)
    return(
    <Box display="flex" alignItems="center" sx={{ gap: 2, padding:'10px' }}>
      <Typography>File Size:</Typography>
      <TextField 
        sx={{ width: '100px' }} 
        id="fileSize" 
        type="number" 
        value={fileSize} 
        onChange={(event) => setFileSize(event.target.value)} 
        InputProps={{
          endAdornment: <InputAdornment position="end">mb</InputAdornment>,
        }}
      />
      <Divider orientation="vertical" flexItem />
      <Typography>Name:</Typography>
      <TextField 
        sx={{ width: '150px' }} 
        id="memetitel" 
        type="text" 
        value={memeName} 
        onChange={(event) => setMemeName(event.target.value)} 
      />
      <Divider orientation="vertical" flexItem />
      <Typography>Description:</Typography>
      <TextField 
        sx={{ width: '250px' }} 
        id="text" 
        type="text" 
        value={memeDescription} 
        onChange={(event) => setMemeDescription(event.target.value)} 
      />
      <Divider orientation="vertical" flexItem />
      <FormControl>
        <RadioGroup
          defaultValue="public"
          name="radio-buttons-group"
          value={memePrivacy}
          onChange={(event) => setMemePrivacy(event.target.value)}
        >
          <FormControlLabel value="public" control={<Radio />} label="public" />
          <FormControlLabel value="unlisted" control={<Radio />} label="unlisted" />
          <FormControlLabel value="private" control={<Radio />} label="private" />
        </RadioGroup>
      </FormControl>
      <ImageEditorButton id="saveMemeBtn" disabled={!templateSelected} onClick={() => handleMemeCreation(fileSize, memeName, memeDescription, memePrivacy, false)}>save</ImageEditorButton>
      <ImageEditorButton id="saveDraftBtn" disabled={!templateSelected} color='info' onClick={() => handleDraftCreation(memeName)}>save draft</ImageEditorButton>
      <ImageEditorButton id="downloadBtn" disabled={!templateSelected} onClick={() => handleMemeCreation(fileSize, memeName, memeDescription, memePrivacy, true)}>download</ImageEditorButton>
    </Box>
    )
}

export default ImageEditorFooter;