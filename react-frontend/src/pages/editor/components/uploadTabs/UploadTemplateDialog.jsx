import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import { useSelector } from 'react-redux';
import ImageUrlTab from './ImageUrlTab';
import FileUploadTab from './FileUploadTab';
import CameraUploadTab from './CameraUploadTab';
import ThirdPartyServiceTab from './ThirdPartyServiceTab';
import HandDrawnTab from './HandDrawnTab';
import { saveTemplate } from '../../../../api/templates';

export const emptyUploadTemplate = {
  name: 'newtemplate',
  type: '',
  content: '',
};

const UploadTemplateDialog = ({ open, setOpen }) => {
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
        console.log("template")
        console.log(statetemplates)
        saveTemplate(template, token);
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
            <Box p={2} display="flex" justifyContent="space-between">
                    <Button
                  variant="contained"
                  color="success"
                  disabled={!template}
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
