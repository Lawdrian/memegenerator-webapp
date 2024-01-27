import React, { useState } from 'react';

import Editor from '../components/Editor';

import { getTemplates } from '../../../api/template';
import { useSelector } from 'react-redux';
import { saveMeme } from '../../../api/meme';
import { useDispatch } from 'react-redux';
import { cacheMeme } from '../../../slices/serverSlice';

export const defaultMemeProps = {
  name: 'myMeme',
  content: '',
  format: '',
  usedTemplateId: '',
  private: false
}


const EditorContainer = () => {
  const [selectedTemplate, setSelectedTemplate] = useState(null)
    const dispatch = useDispatch();
    const storeTemplates = useSelector((state) => state.template);
    const serverReachable = useSelector((state) => state.server.serverReachable);
    const token = useSelector((state) => state.user.token);

    if(!storeTemplates.templatesLoaded) {
      dispatch(getTemplates())
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
      if(serverReachable) {
        console.log("Sending meme to server")
        saveMeme(meme, token)
      } else {
        console.log("Storing meme in redux store")
        dispatch(cacheMeme(meme))
      }

    }

    return (
      <Editor 
        templates={storeTemplates.templates} 
        selectedTemplate={selectedTemplate} 
        setSelectedTemplate={setSelectedTemplate}
        handleSaveMeme={handleSaveMeme}
      />
    )

}

export default EditorContainer;