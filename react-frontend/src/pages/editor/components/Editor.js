import React, {useState} from 'react';
import { Grid } from "@mui/material";
import ImageEditor from "./ImageEditor";
import EditorSidebar from "./EditorSidebar";
import UploadTemplateDialog from './uploadTabs/UploadTemplateDialog';
import { useNavigate } from 'react-router-dom';

import CanvasCreator from '../../CanvasCreator';

const Editor = (props) => {
    const {templates, selectedTemplate, setSelectedTemplate, handleSaveMeme} = {...props}
    const [uploadTemplatePage, setUploadTemplatePage] = useState(false)
    const navigate = useNavigate();

    const renderCanvasPage = () => {
      navigate('../canvas')
    }

    const renderUploadTemplatePage = () => {
      setUploadTemplatePage(true);
    }

    return (
      <Grid container style={{maxHeight: '100vh', overflow: 'auto', }}>
        <UploadTemplateDialog open={uploadTemplatePage} setOpen={setUploadTemplatePage}/>
        <Grid item xs={4}>
          <EditorSidebar templates={templates} selectedTemplate={selectedTemplate} setSelectedTemplate={setSelectedTemplate} renderCreateCanvasPage={renderCanvasPage} renderUploadTemplatePage={renderUploadTemplatePage}/>
        </Grid>
        <Grid item xs={8}>
          <ImageEditor imageUrl={selectedTemplate?.content} handleSaveMeme={handleSaveMeme}/>
        </Grid>
      </Grid>
    )

}

export default Editor;