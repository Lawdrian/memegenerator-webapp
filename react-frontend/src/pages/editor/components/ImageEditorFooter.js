import React, { useState } from 'react';
import { Box, Typography, TextField, Divider } from '@mui/material';

import ImageEditorButton from '../components/ImageEditorButton';

const ImageEditorFooter = ({handleDownload}) => {

    const [fileSize, setFileSize] = useState(1);

    return(
    <Box display="flex" alignItems="center" sx={{ gap: 2, padding:'10px' }}>
      <Typography>File Size:</Typography>
      <TextField sx={{ width: '100px' }} id="fileSize" type="number" name="fontSize" value={fileSize} onChange={(event) => setFileSize(event.target.value)} />
      <Divider orientation="vertical" flexItem />
      <ImageEditorButton onClick={() => handleDownload(fileSize)}>download</ImageEditorButton>
      <ImageEditorButton onClick={() => console.log("TODO: SAVE TO SERVER")}>save to profile</ImageEditorButton>

    </Box>
    )


}

export default ImageEditorFooter;