import React, {useState} from 'react';
import { Grid, ImageListItem, ImageList, Button, ToggleButton, ToggleButtonGroup } from '@mui/material';
const EditorSidebar = (props) => {
  const {templates, selectedTemplate, setSelectedTemplate, renderCreateCanvasPage, renderUploadTemplatePage, renderTemplateStatisticPage} = {...props}
  const [selectedFormat, setSelectedFormat] = useState('image');

  const handleFormatChange = (event) => {
    setSelectedFormat(event.target.value);
  };

  const handleTemplateClick = (template) => {
    setSelectedTemplate(template);
  };

  const filteredTemplates = templates.filter(template => template.format === selectedFormat);


  return (
    <Grid container direction="column" justifyContent="flex-start" style={{height: '100vh', overflow: 'auto'}}>
      <Grid item xs={1}>
        <ToggleButtonGroup
          value={selectedFormat}
          exclusive
          onChange={handleFormatChange}
          aria-label="template format"
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
      <Grid item xs={9} style={{overflow: 'auto', maxHeight: '50vh'}}>
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
          <Button variant="contained" color="primary" disabled={!selectedTemplate} onClick={renderTemplateStatisticPage}>Show Template Statistic</Button>
        </Grid>
        <Grid item>
          <Button variant="contained" color="secondary" onClick={renderCreateCanvasPage}>Create Canvas</Button>
        </Grid>
        <Grid item>
          <Button variant="contained" color="secondary" onClick={renderUploadTemplatePage}>Upload Template</Button>
        </Grid>
      </Grid>
    </Grid>
  );

}

export default EditorSidebar;

