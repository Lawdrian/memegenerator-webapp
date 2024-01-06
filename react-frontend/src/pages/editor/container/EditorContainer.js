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

import { getTemplates } from '../../../api/templates';
import { setTemplates } from '../../../slices/templateSlice';
import { useSelector } from 'react-redux';


const EditorContainer = () => {

    // TODO define correct template structure
    /*
    const imagess = [image1, image2, image3, image4, image5, image6, image7, image8, image9]
    const templateProps =  imagess.map((image, index) => {
      return {
        name: `template${index+1}`,
        type: 'Image',
        content: image,
      }
    })
    */

    
    const storeTemplates = useSelector((state) => state.template.templates);
    const [selectedTemplate, setSelectedTemplate] = useState(null)
    const dispatch = useDispatch()


    useEffect(() => {
      // initiate template fetch from backend into store
      loadTemplates()
    }, [])

    /*
    useEffect(() => {
      setSelectedTemplate(storeTemplates[0])
    }, [storeTemplates])
    */
    const loadTemplates = async () => {
      console.log("loadTemplates")
      const backendTemplates = await getTemplates()

      // Map backendTemplates to match the structure of your templates object
      const templates = backendTemplates.map(template => ({
        id: template._id,
        name: template.name,
        type: template.type,
        content: template.content,
      }));
      //setTemplates(backendTemplates)
      dispatch(setTemplates({ templates: templates }))
      console.log("Templates loaded into frontend")
    }

    return (
      <Editor 
        templates={storeTemplates} 
        selectedTemplate={selectedTemplate} 
        setSelectedTemplate={setSelectedTemplate}
      />
    )

}

export default EditorContainer;