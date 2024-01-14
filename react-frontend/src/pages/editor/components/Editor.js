import React, {useState} from 'react';
import { Grid, Button } from "@mui/material";
import { useNavigate } from 'react-router-dom';

import ImageEditor from "./ImageEditor";
import GifEditor from "./GifEditor";
import EditorSidebar from "./EditorSidebar";
import UploadTemplateDialog from './uploadTabs/UploadTemplateDialog';
import gifImage from '../assets/giphy.gif'
import GifDisplay from './GifDisplay';
import { createGif } from '../../../api/createGif.js';


const Editor = (props) => {
    const {templates, selectedTemplate, setSelectedTemplate} = {...props}
    const [uploadTemplatePage, setUploadTemplatePage] = useState(false)
    const navigate = useNavigate();

    const renderCanvasPage = () => {
      navigate('../canvas')
    }

    const renderUploadTemplatePage = () => {
      setUploadTemplatePage(true);
    }

    const createNewGif = async () => {
      const gifBase64 = templates.find(template => template.type === 'gif')?.content;
      console.log("createNewGif")
      console.log(gifBase64);
      const result = await createGif(gifBase64);
      console.log(result);
    }

    return (
      <Grid container style={{maxHeight: '100vh', overflow: 'auto', }}>
        <UploadTemplateDialog open={uploadTemplatePage} setOpen={setUploadTemplatePage}/>
        <Grid item xs={4}>
          <EditorSidebar templates={templates} selectedTemplate={selectedTemplate} setSelectedTemplate={setSelectedTemplate} renderCreateCanvasPage={renderCanvasPage} renderUploadTemplatePage={renderUploadTemplatePage}/>
        </Grid>
          <Grid item xs={8}>
          {selectedTemplate?.type === 'gif' ? (
              <GifEditor gifBase64={selectedTemplate?.content}/>
            ) : selectedTemplate?.type === 'image' ? (
              <ImageEditor imageUrl={selectedTemplate?.content}/>
            ) : selectedTemplate?.type === 'video' ? (
              <h1>Video Editor</h1>
            ) : <GifDisplay/>
          }
        </Grid>
      </Grid>
    )

}

export default Editor;