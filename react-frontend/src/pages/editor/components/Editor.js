import React, {useState} from 'react';
import { Grid } from "@mui/material";
import ImageEditor from "./ImageEditor";
import EditorSidebar from "./EditorSidebar";
import UploadTemplateDialog from './uploadTabs/UploadTemplateDialog';

const Editor = (props) => {
    const {templates, selectedTemplate, setSelectedTemplate} = {...props}
    const [canvasPage, setCanvasPage] = useState(false)
    const [uploadTemplatePage, setUploadTemplatePage] = useState(false)

    const renderCreateCanvasPage = () => {
      setCanvasPage(true);
    }

    const renderUploadTemplatePage = () => {
      setUploadTemplatePage(true);
    }


    if(canvasPage) {
      return (
        <h1>
          Canvas Editor
        </h1>
      )
    }

    return (
      <Grid container style={{maxHeight: '100vh', overflow: 'auto', }}>
        <UploadTemplateDialog open={uploadTemplatePage} setOpen={setUploadTemplatePage}/>
        <Grid item xs={4}>
          <EditorSidebar templates={templates} selectedTemplate={selectedTemplate} setSelectedTemplate={setSelectedTemplate} renderCreateCanvasPage={renderCreateCanvasPage} renderUploadTemplatePage={renderUploadTemplatePage}/>
        </Grid>
        <Grid item xs={8}>
          <ImageEditor imageUrl={selectedTemplate.content}/>
        </Grid>
      </Grid>
    )

}

export default Editor;