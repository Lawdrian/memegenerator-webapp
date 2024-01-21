import React, {useState, useEffect} from 'react';
import { Grid } from '@mui/material';


import ImageEditor from '../components/ImageEditor';
import image1 from '../assets/cat1.jpg';
import image2 from '../assets/cat2.jpg';
import image3 from '../assets/cat3.jpg';
import image4 from '../assets/cat4.jpg';
import image5 from '../assets/cat5.jpg';
import image6 from '../assets/cat6.jpg';
import image7 from '../assets/cat6.jpg';
import image8 from '../assets/cat6.jpg';
import image9 from '../assets/cat6.jpg';
import Editor from '../components/Editor';
import { useDispatch } from 'react-redux';

import { getTemplates } from '../../../api/template';
import { setTemplates } from '../../../slices/templateSlice';
import { useSelector } from 'react-redux';
import { saveMeme } from '../../../api/meme';

export const defaultMemeProps = {
  name: 'myMeme',
  content: '',
  format: '',
  usedTemplateId: '',
  private: false
}


const EditorContainer = () => {
 
    const storeTemplates = useSelector((state) => state.template.templates);
    const [selectedTemplate, setSelectedTemplate] = useState(null)
    const dispatch = useDispatch()
    const token = useSelector((state) => state.user.token);


    useEffect(() => {
      // initiate template fetch from backend into store
      loadTemplates()
    }, [])

    const loadTemplates = async () => {
      console.log("loadTemplates")
      const backendTemplates = await getTemplates(token)

      // Map backendTemplates to match the structure of your templates object
      const templates = backendTemplates.map(template => ({
        _id: template._id,
        name: template.name,
        format: template.format,
        content: template.content,
      }));
      //setTemplates(backendTemplates)
      dispatch(setTemplates({ templates: backendTemplates }))
      console.log("Templates loaded into frontend")
    }

    const handleSaveMeme = (content, name, privacy) => {
      const meme = {
        ...defaultMemeProps,
        content: content,
        name: name,
        format: selectedTemplate.format,
        templateId: selectedTemplate._id,
        private: privacy
      }
      console.log("handleSaveMeme")
      console.log(meme)
      saveMeme(meme, token)
    }

    return (
      <Editor 
        templates={storeTemplates} 
        selectedTemplate={selectedTemplate} 
        setSelectedTemplate={setSelectedTemplate}
        handleSaveMeme={handleSaveMeme}
      />
    )

}

export default EditorContainer;