import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { AppBar, Box, Button, Dialog, Divider, Grid, Tab, Tabs, TextField, Typography } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';

import ImageUrlTab from './ImageUrlTab';
import FileUploadTab from './FileUploadTab';
import CameraUploadTab from './CameraUploadTab';
import ThirdPartyServiceTab from './ThirdPartyServiceTab';
import HandDrawnTab from './HandDrawnTab';
import { saveTemplate } from '../../../../api/template';

export const emptyUploadTemplate = {
  name: 'newtemplate',
  format: '',
  content: '',
};

const UploadTemplateDialog = ({ open, setOpen }) => {
    const dispatch = useDispatch();

    const [selectedTab, setSelectedTab] = useState(0);
    const [template, setTemplate] = useState(emptyUploadTemplate); 
    const theme = useTheme();
    const statetemplates = useSelector((state) => state.template.templates);
    const token = useSelector((state) => state.user.token);

    const handleChangeTab = (event, newTab) => {
        setSelectedTab(newTab);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleTemplateUpload = () => {
      try {
        console.log("token", token)
        console.log("template")
        console.log(statetemplates)
        dispatch(saveTemplate(template, token));
        console.log("Template uploaded successfully");
      }
      catch (error) {
        console.log(error);
      }
    }

    return (
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xl">
        <Grid container direction="column">
            <Grid item>
              <AppBar position="static" sx={{ backgroundColor: theme.palette.primary.light }}>
                  <Tabs 
                    value={selectedTab} 
                    onChange={handleChangeTab}
                  >
                      <Tab label="File Upload" />
                      <Tab label="Image URL" />
                      <Tab label="Third Party Service" />
                      <Tab label="Camera" />
                      <Tab label="Hand-Drawn" />
                  </Tabs>
              </AppBar>
            </Grid>
            <Grid item style={{ height: '50vh', overflow: 'auto' }}>
              <Box p={3}>
                  {selectedTab === 0 && <FileUploadTab template={template} setTemplate={setTemplate}/>}
                  {selectedTab === 1 && <ImageUrlTab template={template} setTemplate={setTemplate}/>}
                  {selectedTab === 2 && <ThirdPartyServiceTab template={template} setTemplate={setTemplate}/>}
                  {selectedTab === 3 && <CameraUploadTab template={template} setTemplate={setTemplate}/>}
                  {selectedTab === 4 && <HandDrawnTab template={template} setTemplate={setTemplate}/>}
              </Box>
            </Grid>
            <Grid item xs={1}>
            <Box display="flex" alignItems="center" sx={{ gap: 2, padding:'10px' }}>
              <Typography>Template Name:</Typography>
              <TextField 
                sx={{ width: '200px' }} 
                id="text" 
                type="text" 
                value={template.name} 
                onChange={(event) => setTemplate({ ...template, name: event.target.value})} 
              />
              <Divider orientation="vertical" flexItem />
              <Button
                  variant="contained"
                  color="success"
                  disabled={!template.content}
                  onClick={handleTemplateUpload}
                >
                  Upload
                </Button>
                <Button onClick={handleClose} variant="contained" color="primary">
                    Return to Editor
                </Button>
            </Box>
            </Grid>
        </Grid>
      </Dialog>
    );
};

export default UploadTemplateDialog;
