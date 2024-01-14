import React, {useState, useEffect} from 'react';
import { Grid, Select, MenuItem, ImageListItem, ImageList, Button, ToggleButton, ToggleButtonGroup } from '@mui/material';
const EditorSidebar = (props) => {
  const {templates, selectedTemplate, setSelectedTemplate, renderCreateCanvasPage, renderUploadTemplatePage} = {...props}
  const [selectedType, setSelectedType] = useState('image');

  const handleTypeChange = (event) => {
    setSelectedType(event.target.value);
    console.log(filteredTemplates)
    console.log(templates)
  };

  const handleTemplateClick = (template) => {
    setSelectedTemplate(template);
  };

  useEffect(() => {
    console.log("selectedTemplate")
    console.log(selectedTemplate)
  }, [selectedTemplate])

  const filteredTemplates = templates.filter(template => template.type === selectedType);


  return (
    <Grid container direction="column" justifyContent="flex-start" style={{height: '100vh', overflow: 'auto'}}>
      <Grid item xs={1}>
        <ToggleButtonGroup
          value={selectedType}
          exclusive
          onChange={handleTypeChange}
          aria-label="template type"
          style={{width: '100%'}}
          fullWidth
        >
          <ToggleButton value="image" aria-label="Image">
            Image
          </ToggleButton>
          <ToggleButton value="gif" aria-label="GIF">
            GIF
          </ToggleButton>
          <ToggleButton value="video" aria-label="Video">
            Video
          </ToggleButton>
        </ToggleButtonGroup>
      </Grid>
      <Grid item xs={9} style={{overflow: 'auto'}}>
        <ImageList cols={2} gap={15} rowHeight={'auto'} style={{padding:'1rem'}}>
          {filteredTemplates.map((template, index) => (
                <ImageListItem key={index}>
                <img 
                  src={template.content} 
                  alt={template.name} 
                  onClick={() => handleTemplateClick(template)} 
                  loading="lazy"
                  style={template === selectedTemplate ? { boxShadow: '0 0 10px 2px dodgerblue' } : {}}
                />
              </ImageListItem>
          ))}
        </ImageList>
      </Grid>
      <Grid  container item direction='column' xs={2} spacing={2} style={{ alignItems: 'center', paddingTop: '2rem'}}>
        <Grid item>
          <Button variant="contained" color="primary" onClick={renderCreateCanvasPage}>Create Canvas</Button>
        </Grid>
        <Grid item>
          <Button variant="contained" color="secondary" onClick={renderUploadTemplatePage}>Upload Template</Button>
        </Grid>
      </Grid>
    </Grid>
  );

}

export default EditorSidebar;

