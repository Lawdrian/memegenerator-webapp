import React, {useState} from 'react';
import { Grid } from "@mui/material";
import ImageEditor from "./ImageEditor";
import EditorSidebar from "./EditorSidebar";

const Editor = (props) => {
    const {templates, selectedTemplate, setSelectedTemplate} = {...props}
    const [renderCanvasPage, setRenderCanvasPage] = useState(false)

    const renderCreateCanvasPage = () => {
      setRenderCanvasPage(true);
    }


    if(renderCanvasPage) {
      return (
        <h1>
          Canvas Editor
        </h1>
      )
    }

    return (
      <Grid container style={{maxHeight: '100vh', overflow: 'auto', }}>
        <Grid item xs={4}>
          <EditorSidebar templates={templates} selectedTemplate={selectedTemplate} setSelectedTemplate={setSelectedTemplate} renderCreateCanvasPage={renderCreateCanvasPage}/>
        </Grid>
        <Grid item xs={8}>
          <ImageEditor imageUrl={selectedTemplate.content}/>
        </Grid>
      </Grid>
    )

}

export default Editor;