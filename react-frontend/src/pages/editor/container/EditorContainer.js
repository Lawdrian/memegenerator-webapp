import React, {useState} from 'react';
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


const EditorContainer = () => {

    // TODO define correct template structure
    const images = [image1, image2, image3, image4, image5, image6, image7, image8, image9]
    const templateProps =  images.map((image, index) => {
      return {
        name: `template${index+1}`,
        type: 'Image',
        content: image,
      }
    })


    // TODO connect to Redux store

    // TODO initiate template fetch from backend into store

    // TODO fetch template from store
    const [templates, setTemplates] = useState(templateProps)
    const [selectedTemplate, setSelectedTemplate] = useState(templates[0])



    return (
      <Editor 
        templates={templates} 
        selectedTemplate={selectedTemplate} 
        setSelectedTemplate={setSelectedTemplate}
      />
    )

}

export default EditorContainer;