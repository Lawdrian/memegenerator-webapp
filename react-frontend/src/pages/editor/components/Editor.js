import React, {useState} from 'react';
import { Grid } from "@mui/material";
import ImageEditor from "./ImageEditor";
import EditorSidebar from "./EditorSidebar";
import UploadTemplateDialog from './uploadTabs/UploadTemplateDialog';
import { useNavigate } from 'react-router-dom';

import TemplateStatistics from '../../../components/Statistics/TemplateStatistics';

const Editor = (props) => {
    const {templates, selectedTemplate, setSelectedTemplate, handleSaveMeme, handleSaveDraft, draftProps} = {...props}
    const [uploadTemplatePage, setUploadTemplatePage] = useState(false)
    const [templateStatisticPage, setTemplateStatisticPage] = useState(false)
    const navigate = useNavigate();

    const renderCanvasPage = () => {
      navigate('../canvas')
    }
    console.log("selectedTemplate: ", selectedTemplate ? true : false)
    return (
      <Grid container style={{maxHeight: '90vh', overflow: 'auto', }}>
        <UploadTemplateDialog open={uploadTemplatePage} setOpen={setUploadTemplatePage}/>
        <TemplateStatistics template={selectedTemplate} open={templateStatisticPage} setOpen={setTemplateStatisticPage}/>
        <Grid item xs={3}>
          <EditorSidebar 
            templates={templates} 
            selectedTemplate={selectedTemplate} 
            setSelectedTemplate={setSelectedTemplate} 
            renderCreateCanvasPage={renderCanvasPage} 
            renderUploadTemplatePage={() => setUploadTemplatePage(true)}
            renderTemplateStatisticPage={() => setTemplateStatisticPage(true)}
            />
        </Grid>
        <Grid item xs={9}>
          <ImageEditor templateSelected={selectedTemplate ? true : false} imageUrl={selectedTemplate?.content} handleSaveMeme={handleSaveMeme} handleSaveDraft={handleSaveDraft} draftProps={draftProps}/>
        </Grid>
      </Grid>
    )

}

export default Editor;