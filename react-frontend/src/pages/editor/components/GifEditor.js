import React, { useState, useEffect, useRef } from 'react';
import { Stage, Layer, Image } from 'react-konva';
import { Grid } from '@mui/material';
import { useCallback } from 'react';
import imageCompression from 'browser-image-compression';

import EditableTextField from './EditableTextField';
import AnimatedTextField from './AnimatedTextField';
import TextPropertiesForm from './TextPropertiesForm';
import ImageEditorButton from '../components/ImageEditorButton';
import ImageEditorFooter from '../components/ImageEditorFooter';
import { defaultTextProps } from './ImageEditor';
import { GifReader } from 'omggif';
import AnimatedText from './AnimatedText';
import ReactDOMServer from 'react-dom/server';
import 'gifler'

function GifEditor({ gifUrl: gifBase64 }) {
  const [animatedTextFields, setAnimatedTextFields] = useState([]);
  const [gif, setGif] = useState(null);
  const [gifFrames, setGifFrames] = useState([]);
  const [finalGif, setFinalGif] = useState(null);
  const [firstGifFrame, setFirstGifFrame] = useState(null);
  // state that checks if the gif should be rendered on only the first frame displayed
  const [isPreviewing, setIsPreviewing] = useState(false); 
  
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
  

  const defaultAnimatedTextProps = {
    ...defaultTextProps,
    animation: 'none'
  };

  useEffect(() => {
    console.log("gifURL: " + gifBase64)
  }, [gifBase64])


  useEffect(() => {
    const img = new window.Image();
    img.src = gifBase64;
    img.onload = () => {
      setGif(img);

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
  }, [gifBase64]);



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
    setAnimatedTextFields(prevTextFields =>
      prevTextFields.map((textField, index) =>
        index === selectedTextFieldIndex ? newProps : textField
      )
    );
  },
  [selectedTextFieldProps, selectedTextFieldIndex]
  );

  const addAnimatedTextField = () => {
    setIsPreviewing(false);
    setAnimatedTextFields(prevTextFields => [...prevTextFields, {...defaultAnimatedTextProps}]);
  };

  const removeAnimatedTextField = (index) => {
    //const textarea = document.querySelector('textarea');
    //if (textarea) {
     // document.body.removeChild(textarea);
     // }
    setIsPreviewing(false);
    setAnimatedTextFields(prevTextFields => prevTextFields.filter((_, i) => i !== index));
    setSelectedTextFieldIndex(null);
    setSelectedTextFieldProps(null);
  };

  const clearTextFields = () => {
    setIsPreviewing(false);
    setAnimatedTextFields([]);
    setSelectedTextFieldIndex(null);
    setSelectedTextFieldProps(null);
  };

  const applyAnimations = () => {
    // Create a new canvas
    const newCanvas = document.createElement('canvas');
    const newContext = newCanvas.getContext('2d');
    newCanvas.width = gif.width;
    newCanvas.height = gif.height;
  
    // Draw the original GIF onto the new canvas
    newContext.drawImage(gif, 0, 0, gif.width, gif.height);
  
    // Use AnimatedText component for each textField
    animatedTextFields.forEach(({ text, x, y, animationType }) => {
      const animatedTextComponent = <AnimatedText key={"text"} text={"hallo"} x={10} y={10} animationType={"move"} />;
      
      // Render the AnimatedText component to the newCanvas
      const markup = ReactDOMServer.renderToStaticMarkup(animatedTextComponent);
      const svg = new Blob([`<svg>${markup}</svg>`], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svg);
      
      const img = new window.Image();
      img.src = url;
      newContext.drawImage(img, 0, 0);
      
      URL.revokeObjectURL(url);
    });
  
    // Convert the new canvas to a data URL (base64 string)
    const newGifBase64 = newCanvas.toDataURL('image/gif');
    setFinalGif(newGifBase64);
  
    // Now, `newGifBase64` contains the base64 string of the resulting GIF
    // You can save it, display it, or perform other actions with it
  };


  // TODO Adapt!!!
  // download the image with the given resolution
  const handleDownload = async (targetFileSize) => {
    console.log("final Gif")
    console.log(finalGif)
    const transformers = stageRef.current.find('Transformer');
    transformers.forEach(transformer => transformer.hide());
  
  
    transformers.forEach(transformer => transformer.show());
  
    // Convert data URL to file
    const imageFile = await fetch(finalGif)
      .then(res => res.blob())
      .then(blob => new File([blob], 'canvas.gif', { type: 'image/gif' }));
  
    // Compress the image file
    const options = {
      maxSizeMB: targetFileSize || 1, // (max file size in MB)
      maxWidthOrHeight: 1920, // this will also reduce the image dimensions
      useWebWorker: true
    };
    console.log('compressing gif');
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
      link.download = 'meme.gif';
      link.href = compressedDataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };
  };

  // TODO Run Gif 
  const runGif = () => {
    console.log("run gif")
    console.log(gifFrames[0])
    //setIsPreviewing(true);
  }

  return (
    <Grid container direction="column" style={{ backgroundColor: '#F5F5F5', maxHeight: '100vh', overflow: 'hidden', }}>
      <Grid item style={{ height: '10vh', backgroundColor: 'white', display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }} >
        {selectedTextFieldProps ? (
          <TextPropertiesForm
            removeTextField={() => removeAnimatedTextField(selectedTextFieldIndex)}
            textProps={selectedTextFieldProps}
            onPropChange={(event) => handlePropChange(event.target.name, event.target.value)}
          />
        )
        : (
          <Grid container item spacing={2} style={{ padding: '10px' }}>
            <Grid item>
              <ImageEditorButton onClick={addAnimatedTextField}>Add Text Field</ImageEditorButton>
            </Grid>
            <Grid item>
              <ImageEditorButton onClick={clearTextFields} color={"error"}>Clear</ImageEditorButton>
            </Grid>
            <Grid item>
              <ImageEditorButton onClick={runGif} color={"success"}>Preview</ImageEditorButton>
            </Grid>
            <Grid item>
            <ImageEditorButton onClick={applyAnimations} color={"success"}>generate</ImageEditorButton>
          </Grid>
        </Grid>
        )
        }
      </Grid>
      <Grid item ref={stageContainerRef} style={{ height: 'calc(100vh - 20vh)', padding: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Stage width={stageSize.width} height={stageSize.height} ref={stageRef}>
          <Layer>
            {gif && <Image image={isPreviewing ? gif : gif} width={stageSize.width} height={stageSize.height} />}
          </Layer>
          {animatedTextFields.map((textProps, index) => (
            isPreviewing ? (
              <AnimatedTextField 
                key={index}
                textProps={textProps}
                animation={textProps.animation}
              />
            ) : (
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
            )
          ))}
        </Stage>
      </Grid>
      <Grid item style={{ height: '10vh', padding: '10px', backgroundColor: 'white', display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
        <ImageEditorFooter handleDownload={(fileSize) => handleDownload(fileSize)} />
      </Grid>
    </Grid>
  );
};

export default GifEditor;