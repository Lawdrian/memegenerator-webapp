import React, {useEffect, useState} from 'react';
import { TextField, IconButton, Select, MenuItem, Grid, Divider } from '@mui/material'
import { throttle } from 'lodash';
import { Box, Typography } from '@mui/material';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';

import {ImageEditorButton} from './ImageEditorButton';
// Define your font families
const fontFamilies = ['Arial', 'Helvetica', 'Times New Roman', 'Courier New', 'Verdana', 'Trebuchet MS'];


function TextPropertiesForm({ textProps, onPropChange, removeTextField }) {
  const [alignment, setAlignment] = useState(textProps.align ?? 'center');

  // update the alignment property of parent when the internal alignment state changes
  useEffect(() => {
    const syntheticEvent = {
      target: {
        name: 'align',
        value: alignment
      },
    };
    onPropChange(syntheticEvent);
  }, [alignment]);

  const handleFontFamilyChange = (event) => {
    const syntheticEvent = {
      target: {
        name: 'fontFamily',
        value: event.target.value,
      },
    };
    onPropChange(syntheticEvent);
  };

  const handleToggleBold = () => {
    const syntheticEvent = {
      target: {
        name: 'fontWeight',
        value: textProps.fontWeight === 'bold' ? 'normal' : 'bold',
      },
    };
    onPropChange(syntheticEvent);
  };
  
  const handleToggleItalic = () => {
    const syntheticEvent = {
      target: {
        name: 'fontStyle',
        value: textProps.fontStyle === 'italic' ? 'normal' : 'italic',
      },
    };
    onPropChange(syntheticEvent);
  };
  
  const handleToggleUnderline = () => {
    const syntheticEvent = {
      target: {
        name: 'textDecoration',
        value: textProps.textDecoration === 'underline' ? 'none' : 'underline',
      },
    };
    onPropChange(syntheticEvent);
  };

  const handleToggleAlignment = () => {
    switch(textProps.align) {
      case 'left': 
        setAlignment('center');
        break;
      case 'center': 
        setAlignment('right');
        break;
      case 'right': 
        setAlignment('left');
        break;
    }
  }

  const handleFontColorChange = throttle((value) => {
    const syntheticEvent = {
      target: {
        name: 'fill',
        value: value,
      },
    };
    onPropChange(syntheticEvent);
  }, 30, { leading: false}) // 30ms throttle time, no leading edge (will only call once every 30ms)


  return (
    <Box display="flex" alignItems="center" sx={{ gap: 2, padding:'10px' }}>
      <Typography>Size:</Typography>
      <TextField sx={{ width: '100px' }} id="fontSize" type="number" name="fontSize" value={textProps.fontSize} onChange={onPropChange} />
      <Divider orientation="vertical" flexItem />
      
      <Typography>Font:</Typography>
      <Select
        labelId="font-family-label"
        value={textProps.fontFamily}
        onChange={handleFontFamilyChange}
      >
        {fontFamilies.map((fontFamily) => (
          <MenuItem key={fontFamily} value={fontFamily}>
            {fontFamily}
          </MenuItem>
        ))}
      </Select>
      <Divider orientation="vertical" flexItem />

      <Typography>Color:</Typography>
      <TextField
        id="fill"
        type="color"
        name="fill"
        value={textProps.fill}
        onChange={(event) => handleFontColorChange(event.target.value)}
        sx={{ width: 50, height: 50, border: 'none', padding: 0, flexShrink: 0 }}
      />
      <Divider orientation="vertical" flexItem />

      <Typography>Style:</Typography>

      <IconButton onClick={handleToggleBold} color={textProps.fontWeight === 'bold' ? 'primary' : 'default'}>
        <FormatBoldIcon />
      </IconButton>
      <IconButton onClick={handleToggleItalic} color={textProps.fontStyle === 'italic' ? 'primary' : 'default'}>
        <FormatItalicIcon />
      </IconButton>
      <IconButton onClick={handleToggleUnderline} color={textProps.textDecoration === 'underline' ? 'primary' : 'default'}>
        <FormatUnderlinedIcon />
      </IconButton>
      <IconButton onClick={handleToggleAlignment} color='default'>
          {alignment === 'left' ? 
            <FormatAlignLeftIcon /> : 
            alignment === 'center' ? 
            <FormatAlignCenterIcon /> : 
            <FormatAlignRightIcon />
          }
      </IconButton>

      <Divider orientation="vertical" flexItem />

      <ImageEditorButton onClick={removeTextField} color="error">
        Delete Textfield
      </ImageEditorButton>
    </Box>
  );
}

export default TextPropertiesForm;