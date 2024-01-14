import React, { useState, useEffect, useRef } from 'react';
import { Stage, Layer, Image } from 'react-konva';
import { Grid } from '@mui/material';
import { useCallback } from 'react';
import imageCompression from 'browser-image-compression';

import EditableTextField from './EditableTextField';
import TextPropertiesForm from './TextPropertiesForm';
import ImageEditorButton from '../components/ImageEditorButton';
import ImageEditorFooter from '../components/ImageEditorFooter';

export const defaultTextProps = {
  fontSize: 40,
  fontFamily: 'Arial',
  fill: '#000000',
  backgroundColor: '#ca2b2b',
  fontStyle: 'normal',
  fontWeight: 'normal',
  textDecoration: 'none',
  align: 'center',
};

function ImageEditor({ imageUrl }) {
  const [textFields, setTextFields] = useState([]);
  const [image, setImage] = useState(null);

  // state variables for for text properties form
  const [selectedTextFieldIndex, setSelectedTextFieldIndex] = useState(null);
  const [selectedTextFieldProps, setSelectedTextFieldProps] = useState(null);

  const [stageSize, setStageSize] = useState({width: window.innerWidth, height: window.innerHeight});


  const stageRef = useRef(null);
  const stageContainerRef = useRef(null);

  //change later to dynamically adjust to container size
  //const stageWidth = 800; // replace with your desired width
  //const stageHeight = 600; // replace with your desired height
  const initialTextWidth = 200;

  useEffect(() => {
    console.log("imageUrl: " + imageUrl)
  }, [imageUrl])

  // set the image state once the image is loaded and scale the image to fit the container
  useEffect(() => {
    const img = new window.Image();
    img.src = imageUrl;
    img.onload = () => {
      setImage(img);

      const updateStageSize = () => {
        const parentWidth = stageContainerRef.current.offsetWidth;
        const parentHeight = stageContainerRef.current.offsetHeight;

        const scale = Math.min(parentWidth / img.naturalWidth, parentHeight / img.naturalHeight);

        setStageSize({
          width: img.naturalWidth * scale * 0.8,
          height: img.naturalHeight * scale * 0.8,
        });
      };
  
      // dynamically scale the image to fit the container
      updateStageSize();
        window.addEventListener('resize', updateStageSize);
  
      return () => window.removeEventListener('resize', updateStageSize);
    };

  }, [imageUrl]);



  const handleTextFieldSelect = (index, props) => {
    setSelectedTextFieldIndex(index);
    setSelectedTextFieldProps(props);
  };

  const handleTextFieldDeselect = () => {
    setSelectedTextFieldIndex(null);
    setSelectedTextFieldProps(null);
  }

  // handlePropChange is called when a property of a textfield is changed in the TextPropertiesForm
  const handlePropChange = useCallback((name, value) => {
    const newProps = {
      ...selectedTextFieldProps,
      [name]: value,
    };
    setSelectedTextFieldProps(newProps);
    setTextFields(prevTextFields =>
      prevTextFields.map((textField, index) =>
        index === selectedTextFieldIndex ? newProps : textField
      )
    );
  },
  [selectedTextFieldProps, selectedTextFieldIndex]
  );

  const addTextField = () => {
    setTextFields(prevTextFields => [...prevTextFields, {...defaultTextProps}]);
  };

  const removeTextField = (index) => {
    //const textarea = document.querySelector('textarea');
    //if (textarea) {
     // document.body.removeChild(textarea);
     // }

    setTextFields(prevTextFields => prevTextFields.filter((_, i) => i !== index));
    setSelectedTextFieldIndex(null);
    setSelectedTextFieldProps(null);
  };

  const clearTextFields = () => {
    setTextFields([]);
    setSelectedTextFieldIndex(null);
    setSelectedTextFieldProps(null);
  };

  /*
  const handleDownload = async () => {
    
    const transformers = stageRef.current.find('Transformer');
    transformers.forEach(transformer => transformer.hide());
  
    const dataUrl = stageRef.current.toDataURL({mimeType: 'image/png', quality: 1});
  
    transformers.forEach(transformer => transformer.show());

    const link = document.createElement('a');
    link.download = 'canvas.png';
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  */

  // download the image with the given resolution
  const handleDownload = async (targetFileSize) => {
    
    const transformers = stageRef.current.find('Transformer');
    transformers.forEach(transformer => transformer.hide());
  
    const dataUrl = stageRef.current.toDataURL({mimeType: 'image/png', quality: 1});
  
    transformers.forEach(transformer => transformer.show());
  
    // Convert data URL to file
    const imageFile = await fetch(dataUrl)
      .then(res => res.blob())
      .then(blob => new File([blob], 'canvas.png', { type: 'image/png' }));
  
    // Compress the image file
    const options = {
      maxSizeMB: targetFileSize || 1, // (max file size in MB)
      maxWidthOrHeight: 1920, // this will also reduce the image dimensions
      useWebWorker: true
    };
    console.log('compressing image');
    const compressedFile = await imageCompression(imageFile, options);
    console.log('done compressing');

    if(compressedFile.size / 1048576 > targetFileSize){
      console.error('Cannot compress file this much');
    }

    // Convert compressed file to data URL
    const reader = new FileReader();
    reader.readAsDataURL(compressedFile);
    reader.onloadend = () => {
      const compressedDataUrl = reader.result;
  
      // Download the compressed image
      const link = document.createElement('a');
      link.download = 'meme.png';
      link.href = compressedDataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };
  };

  return (
    <Grid container direction="column" style={{ backgroundColor: '#F5F5F5', maxHeight: '100vh', overflow: 'hidden', }}>
      <Grid item style={{ height: '10vh', backgroundColor: 'white', display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }} >
        {selectedTextFieldProps ? (
          <TextPropertiesForm
            removeTextField={() => removeTextField(selectedTextFieldIndex)}
            textProps={selectedTextFieldProps}
            onPropChange={(event) => handlePropChange(event.target.name, event.target.value)}
          />
        )
        : (
          <Grid container item spacing={2} style={{ padding: '10px' }}>
            <Grid item>
            <ImageEditorButton onClick={addTextField}>Add Text Field</ImageEditorButton>
            </Grid>
            <Grid item>
            <ImageEditorButton onClick={clearTextFields} color={"error"}>Clear</ImageEditorButton>
            </Grid>
          </Grid>
        )
        }
      </Grid>
      <Grid item ref={stageContainerRef} style={{ height: 'calc(100vh - 20vh)', padding: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Stage width={stageSize.width} height={stageSize.height} ref={stageRef}>
          <Layer>
            {image && <Image image={image} width={stageSize.width} height={stageSize.height} />}
          </Layer>
          {textFields.map((textProps, index) => (
            <EditableTextField 
              initialTextWidth={initialTextWidth}
              initialPosition={{ x: 50, y: 80 }}
              stageRef={stageRef}
              key={index}
              isSelected={index === selectedTextFieldIndex}
              textProps={textProps}
              onSelect={() => handleTextFieldSelect(index, textProps)}
              onDeselect={() => handleTextFieldDeselect()}
            />
          ))}
        </Stage>
      </Grid>
      <Grid item style={{ height: '10vh', padding: '10px', backgroundColor: 'white', display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
        <ImageEditorFooter handleDownload={(fileSize) => handleDownload(fileSize)} />
      </Grid>
    </Grid>
  );
};

export default ImageEditor;