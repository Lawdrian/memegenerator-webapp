import React, { useState, useEffect, useRef } from 'react';
import { Stage, Layer, Image } from 'react-konva';
import { Grid } from '@mui/material';
import { useCallback } from 'react';
import EditableTextField from './EditableTextField';
import TextPropertiesForm from './TextPropertiesForm';
import ImageEditorButton from '../components/ImageEditorButton';

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
  

  const defaultTextProps = {
    fontSize: 40,
    fontFamily: 'Arial',
    fill: '#000000',
    backgroundColor: '#ca2b2b',
    fontStyle: 'normal',
    fontWeight: 'normal',
    textDecoration: 'none',
    align: 'center',
  };

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

  const handleDownload = () => {
    const transformers = stageRef.current.find('Transformer');
    transformers.forEach(transformer => transformer.hide());
  
    const dataUrl = stageRef.current.toDataURL();
  
    transformers.forEach(transformer => transformer.show());
  
    const link = document.createElement('a');
    link.download = 'canvas.png';
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Grid container direction="column" style={{ backgroundColor: '#F5F5F5', maxHeight: '100vh', overflow: 'auto', }}>
      <Grid item style={{ height: '10vh', backgroundColor: 'white', display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }} >
        {selectedTextFieldProps ? (
          <TextPropertiesForm
            removeTextField={() => removeTextField(selectedTextFieldIndex)}
            textProps={selectedTextFieldProps}
            onPropChange={(event) => handlePropChange(event.target.name, event.target.value)}
          />
        )
        : (
          <Grid item style={{ padding: '10px' }}>
            <ImageEditorButton onClick={addTextField}>Add Text Field</ImageEditorButton>
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
        <ImageEditorButton onClick={handleDownload}>Download Image</ImageEditorButton>
      </Grid>
    </Grid>
  );
};

export default ImageEditor;