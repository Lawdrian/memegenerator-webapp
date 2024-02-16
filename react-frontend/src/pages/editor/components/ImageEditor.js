import React, { useState, useEffect, useRef } from 'react';
import { Stage, Layer, Image, Rect } from 'react-konva';
import { Grid } from '@mui/material';
import { useCallback } from 'react';
import imageCompression from 'browser-image-compression';
import { throttle } from 'lodash';
import EditableTextField from './EditableTextField';
import TextPropertiesForm from './TextPropertiesForm';
import ImageEditorFooter from '../components/ImageEditorFooter';
import { useSelector } from 'react-redux';
import { ImageEditorButton } from './ImageEditorButton';

export const defaultTextProps = {
  fontSize: 40,
  fontFamily: 'Arial',
  fill: '#000000',
  backgroundColor: '#ca2b2b',
  fontStyle: 'normal',
  fontWeight: 'normal',
  textDecoration: 'none',
  align: 'center',
  position: { x: 50, y: 80 },
  rotation: 0,
  text: 'Some text',
};

function ImageEditor({ imageUrl, handleSaveMeme, handleSaveDraft, draftProps }) {
  const [textFields, setTextFields] = useState([]);
  const [image, setImage] = useState(null);
  const dictation = useSelector((state) => state.dictation);

  // state variables for for text properties form
  const [selectedTextFieldIndex, setSelectedTextFieldIndex] = useState(null);
  //const [selectedTextFieldProps, setSelectedTextFieldProps] = useState(null);

  const [stageSize, setStageSize] = useState({width: window.innerWidth, height: window.innerHeight});


  const stageRef = useRef(null);
  const stageContainerRef = useRef(null);

  //change later to dynamically adjust to container size
  //const stageWidth = 800; // replace with your desired width
  //const stageHeight = 600; // replace with your desired height
  const initialTextWidth = 200;

  // set the image state once the image is loaded and scale the image to fit the container
  useEffect(() => {
    const img = new window.Image();
    img.src = imageUrl;
    img.onload = () => {
      setImage(img);

      const updateStageSize = () => {
        if(stageContainerRef.current) { 
        const parentWidth = stageContainerRef.current.offsetWidth;
        const parentHeight = stageContainerRef.current.offsetHeight;

        const scale = Math.min(parentWidth / img.naturalWidth, parentHeight / img.naturalHeight);

        setStageSize({
          width: img.naturalWidth * scale * 0.8,
          height: img.naturalHeight * scale * 0.8,
        });
      };
    }
  
      // dynamically scale the image to fit the container
      updateStageSize();
        window.addEventListener('resize', updateStageSize);
  
      return () => window.removeEventListener('resize', updateStageSize);
    };

  }, [imageUrl]);

  useEffect(() => {
    if(draftProps) {
      setTextFields(draftProps.textProperties)
    }
  }, [draftProps])




  const handleTextFieldSelect = (index, props) => {
    setSelectedTextFieldIndex(index);
    //setSelectedTextFieldProps(props);
  };

  const handleTextFieldDeselect = () => {
    setSelectedTextFieldIndex(null);
    //setSelectedTextFieldProps(null);
  }

  // handlePropChange is called when a property of a textfield is changed in the TextPropertiesForm
  const handlePropChange = useCallback((name, value) => {
    const newProps = {
      ...textFields[selectedTextFieldIndex],
      [name]: value,
    };
    //setSelectedTextFieldProps(newProps);
    setTextFields(prevTextFields =>
      prevTextFields.map((textField, index) =>
        index === selectedTextFieldIndex ? newProps : textField
      )
    );
  },
  [textFields, selectedTextFieldIndex]
  );

  // update the textField porperties state once a property inside the EditableTextField component changes
  const handleEditableTextFieldChange = throttle((property, value, key) => {
    //setSelectedTextFieldProps({...selectedTextFieldProps, position: position});
    setTextFields(prevTextFields =>
      prevTextFields.map((textField, index) =>
        index === key ? {...textField, [property]: value} : textField
      )
    );
  }, 300, { leading: false})

  const handleTextChange = throttle((text, key) => {
    //setSelectedTextFieldProps({...selectedTextFieldProps, position: position});
    setTextFields(prevTextFields =>
      prevTextFields.map((textField, index) =>
        index === key ? {...textField, text: text} : textField
      )
    );
  }, 300, { leading: false})

  const addTextField = () => {
    setTextFields(prevTextFields => [...prevTextFields, {...defaultTextProps}]);
    //setSelectedTextFieldIndex(textFields.length-1);
    //setSelectedTextFieldProps({...defaultTextProps});
  };

  const removeTextField = (index) => {
    //const textarea = document.querySelector('textarea');
    //if (textarea) {
     // document.body.removeChild(textarea);
     // }

    setTextFields(prevTextFields => prevTextFields.filter((_, i) => i !== index));
    setSelectedTextFieldIndex(null);
    //setSelectedTextFieldProps(null);
  };

  const clearTextFields = () => {
    setTextFields([]);
    setSelectedTextFieldIndex(null);
    //setSelectedTextFieldProps(null);
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
  const handleMemeCreation = async (targetFileSize, memeName, memeDescription, memePrivacy, download) => {
    
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
    const compressedFile = await imageCompression(imageFile, options);
    // display an error message if the file size is too big after compression
    if(compressedFile.size / 1048576 > targetFileSize){
      console.error('Cannot compress file this much');
      alert('Cannot compress file this much');
    }

    // Convert compressed file to data URL
    const reader = new FileReader();
    reader.readAsDataURL(compressedFile);
    reader.onloadend = () => {
      const compressedDataUrl = reader.result;
      console.log(compressedDataUrl)
      if(download == true) {
        // Download the compressed image
        const link = document.createElement('a');
        link.download = `${memeName.replace(/\s/g, '') || 'meme'}.png`; // delete spaces
        link.href = compressedDataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        // Upload the compressed image
        handleSaveMeme(compressedDataUrl, memeName, memeDescription, memePrivacy);
      }
    };
  };

  const handleDraftCreation = (draftName) => {
    handleSaveDraft(textFields, draftName);
  }

  useEffect(() => {
    if(dictation.caption.value !== "") {
      setTextFields(textFields.map((item, index) => {
        if (index !== dictation.caption.index) {
          // This isn't the item we care about - keep it as-is
          return item;
        }
        // Otherwise, this is the one we want - return an updated value
        return {
          ...item,
          text: dictation.caption.value
        };
      }))
    }
  }, [dictation.caption]);

  useEffect(() => {
    console.log(selectedTextFieldIndex)
    console.log("dictation.selectCaption: ", dictation.selectCaption)
    if(dictation.selectCaption !== null) {
      setSelectedTextFieldIndex(dictation.selectCaption);
    }
  }, [dictation.selectCaption]);

  return (
    <Grid container direction="column" style={{ backgroundColor: '#F5F5F5', maxHeight: '90vh', overflow: 'clip'}}>
      <Grid item style={{ height: '10vh', backgroundColor: 'white', display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }} >
        {textFields[selectedTextFieldIndex] ? (
          <TextPropertiesForm
            removeTextField={() => removeTextField(selectedTextFieldIndex)}
            textProps={textFields[selectedTextFieldIndex] ?? null}
            onPropChange={(event) => handlePropChange(event.target.name, event.target.value)}
          />
        )
        : (
          <Grid container item spacing={2} style={{ padding: '10px' }}>
            <Grid item>
            <ImageEditorButton id="addTextFieldBtn" onClick={addTextField}>Add Caption</ImageEditorButton>
            </Grid>
            <Grid item>
            <ImageEditorButton id="clearBtn" onClick={clearTextFields} color={"error"}>Clear</ImageEditorButton>
            </Grid>
          </Grid>
        )
        }
      </Grid>
      <Grid item ref={stageContainerRef} style={{ width: '100%', display: 'block', height: 'calc(100vh - 30vh)', padding: '20px', justifyContent: 'center', alignItems: 'center', overflow: 'clip' }}>  
      <Stage width={stageSize.width} height={stageSize.height} ref={stageRef}>
          <Layer>
            {image && <Image image={image} width={stageSize.width} height={stageSize.height} />}
            {image && <Rect width={stageSize.width} height={stageSize.height} stroke='black' strokeWidth={5} />}
          </Layer>
          {textFields.map((textProps, index) => (
            <EditableTextField 
              initialTextWidth={initialTextWidth}
              onPropertyChange={(property, value) => handleEditableTextFieldChange(property, value, index)}
              stageRef={stageRef}
              key={index}
              isSelected={index === selectedTextFieldIndex}
              textProps={textProps}
              onSelect={() => handleTextFieldSelect(index, textProps)}
              onDeselect={() => handleTextFieldDeselect(index)}
            />
          ))}
        </Stage>
      </Grid>
      <Grid item style={{ height: '10vh', padding: '10px', backgroundColor: 'white', display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
        <ImageEditorFooter handleMemeCreation={(fileSize, memeName, description, privacy, local) => handleMemeCreation(fileSize, memeName, description, privacy, local)} handleDraftCreation={(draftName) => handleDraftCreation(draftName)} />
      </Grid>
    </Grid>
  );
};

export default ImageEditor;