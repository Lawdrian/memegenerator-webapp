import React, { useState, useEffect, useRef } from 'react';
import { Stage, Layer, Image, Transformer } from 'react-konva';
import useImage from 'use-image';
import { useSelector } from 'react-redux';
import { Grid, ImageListItem, ImageList, Typography, Box, Button } from '@mui/material';
import { Resizable } from 'react-resizable';
import 'react-resizable/css/styles.css';
import { useNavigate } from 'react-router-dom';

import { saveTemplate } from '../api/templates';


// this functional component renders a movable and transformable konva Image component
const URLImage = ({ image }) => {
  const [img, setImg] = useState(null);
  const imageRef = useRef();
  const trRef = useRef();

  const initialImageHeight = 400;

  // load image and set initial height and width
  useEffect(() => {
    const loadImage = new window.Image();
    loadImage.src = image.content;
    loadImage.onload = () => {
      setImg(loadImage);
      const aspectRatio = loadImage.width / loadImage.height;
      loadImage.height = initialImageHeight;
      loadImage.width = initialImageHeight * aspectRatio;   
    };
  }, [image]);

  // set transformer nodes to imageRef
  useEffect(() => {
    if (trRef.current) {
      trRef.current.nodes([imageRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [img]);

  return img ? 
  <>
    <Image 
      ref={imageRef}
      image={img}
      draggable
    />
    <Transformer ref={trRef} />
  </>
   : null
};

const CanvasCreator = () => {
  const [selectedTemplates, setSelectedTemplates] = useState([]);
  const [stageDimensions, setStageDimensions] = useState({ width: 500, height: 500 });
  const stageRef = useRef(null);
  const templates = useSelector((state) => state.template.templates);
  const token = useSelector((state) => state.user.token);
  const navigate = useNavigate();


  const imageTemplates = templates.filter(template => template.type === 'Image');


  // Function to handle template selection
  const handleTemplateSelect = (template) => {
    console.log("handleTemplateSelect")
    console.log(template)
    if(selectedTemplates.includes(template)) {
      setSelectedTemplates(selectedTemplates.filter(t => t !== template));
    } else {
      setSelectedTemplates([...selectedTemplates, template]);
    }
  };

  // TODO Refactor since this function is 2 times in use
  const handleTemplateUpload = () => {
    
      const transformers = stageRef.current.find('Transformer');
      transformers.forEach(transformer => transformer.hide());
    
      const dataUrl = stageRef.current.toDataURL({mimeType: 'image/png', quality: 1});
    
      transformers.forEach(transformer => transformer.show());

    try {
      console.log("template")
      console.log(selectedTemplates)
      saveTemplate(dataUrl, token);
      console.log("Template uploaded successfully");
    }
    catch (error) {
      console.log(error);
    }
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={4} style={{overflow: 'auto'}}>
        <ImageList cols={2} gap={15} rowHeight={'auto'} style={{ maxHeight:'80vh', padding:'1rem'}}>
          {imageTemplates.map((template, index) => (
                <ImageListItem key={index}>
                <img 
                  src={template.content} 
                  alt={template.name} 
                  onClick={() => handleTemplateSelect(template)} 
                  loading="lazy"
                  style={ selectedTemplates.includes(template) ? { boxShadow: '0 0 10px 2px dodgerblue' } : {}}
                />
              </ImageListItem>
          ))}
        </ImageList>
      </Grid>
      <Grid item xs={8}>
        <Grid container xs={8} style={{ display: 'flex', flexDirection: 'column', height: '90vh' }}>
           <Grid item>
            <Typography variant='h4'>Create your Canvas</Typography>
          </Grid>
          <Grid item>
            <Resizable
              width={stageDimensions.width}
              height={stageDimensions.height}
              onResize={(event, { element, size, handle }) => {
                setStageDimensions({ width: size.width, height: size.height });
              }}
            >
              <div
                style={{
                  width: stageDimensions.width,
                  height: stageDimensions.height,
                  border: 'solid 1px black',
                }}
              >
                <Stage
                  ref={stageRef}
                  width={stageDimensions.width}
                  height={stageDimensions.height}
                >
                  <Layer>
                    {selectedTemplates.map((template, i) => {
                      return <URLImage key={i} image={template} />;
                    })}
                  </Layer>
                </Stage>
              </div>
            </Resizable>
          </Grid>
          <Grid item style={{ marginTop: 'auto' }}>
            <Box p={2} display="flex" justifyContent="flex-start" gap={2}>
              <Button
                variant="contained"
                color="success"
                disabled={!selectedTemplates}
                onClick={handleTemplateUpload}
              >
                Upload
              </Button>
              <Button onClick={() => navigate('../editor')} variant="contained" color="primary">
                  Go to Editor
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default CanvasCreator;