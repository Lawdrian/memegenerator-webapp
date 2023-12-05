import React, { useState, useEffect, useRef } from 'react';
import EditableTextField from './EditableTextField';
import { Stage, Layer, Image } from 'react-konva';

function ImageEditor({ imageUrl }) {
  const [textFields, setTextFields] = useState([]);
  const [image, setImage] = useState(null);
  const stageRef = useRef(null);

  //change later to dynamically adjust to container size
  const stageWidth = 800; // replace with your desired width
  const stageHeight = 600; // replace with your desired height


  useEffect(() => {
    const img = new window.Image();
    img.src = imageUrl;
    img.onload = () => {
      setImage(img);
    };
  }, [imageUrl]);

  //const stage = stageRef.current.getStage();

  const addTextField = () => {
    setTextFields(prevTextFields => [...prevTextFields, {}]);
  };

  const removeTextField = (index) => {
    setTextFields(prevTextFields => prevTextFields.filter((_, i) => i !== index));
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
    <div>
      <div>
        <button onClick={addTextField}>Add Text Field</button>
        <button onClick={handleDownload}>Download Image</button>
        {textFields.map((_, index) => (
          <button key={index} onClick={() => removeTextField(index)}>Remove Text Field</button>
        ))}
      </div>
      <div>
        <Stage width={stageWidth} height={stageHeight} ref={stageRef}>
        <Layer>
        {image && <Image image={image} width={stageWidth} height={stageHeight} />}
        </Layer>
          {textFields.map((_, index) => (
            <EditableTextField 
              stageRef={stageRef}
              key={index}
              onRemove={() => removeTextField(index)}
            />
          ))}
        </Stage>
      </div>
    </div>
  );
};

export default ImageEditor;