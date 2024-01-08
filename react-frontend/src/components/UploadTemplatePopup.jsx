import React, { useState } from 'react';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import ImageUrlTab from '../pages/uploadTabs/ImageUrlTab';
import FileUploadTab from '../pages/uploadTabs/FileUploadTab';
import CameraUploadTab from '../pages/uploadTabs/CameraUploadTab';
import ThirdPartyServiceTab from '../pages/uploadTabs/ThirdPartyServiceTab';
import HandDrawnTab from '../pages/uploadTabs/HandDrawnTab';

const UploadTemplatePopup = ({ onClose }) => {
    const [open, setOpen] = useState(false);
    const [selectedTab, setSelectedTab] = useState(0);

    const handleChangeTab = (event, newTab) => {
        setSelectedTab(newTab);
    };

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Grid>
            <Button variant="contained" color="secondary" onClick={handleOpen}>
                Upload Templaes
            </Button>
            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="ld">
                <AppBar position="static">
                    <Tabs value={selectedTab} onChange={handleChangeTab}>
                        <Tab label="File Upload" />
                        <Tab label="Image URL" />
                        <Tab label="Third Party Service" />
                        <Tab label="Camera" />
                        <Tab label="Hand-Drawn" />
                    </Tabs>
                </AppBar>
                <Box p={3}>
                    {selectedTab === 0 && <FileUploadTab />}
                    {selectedTab === 1 && <ImageUrlTab />}
                    {selectedTab === 2 && <ThirdPartyServiceTab />}
                    {selectedTab === 3 && <CameraUploadTab />}
                    {selectedTab === 4 && <HandDrawnTab />}
                </Box>
                <Box p={2} display="flex" justifyContent="flex-end">
                    <Button onClick={handleClose} variant="contained" color="primary">
                        Return to Editor
                    </Button>
                </Box>
            </Dialog>
        </Grid>
    );
};

export default UploadTemplatePopup;
