import React, { useEffect, useState } from 'react';

import Editor from '../components/Editor';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { getTemplates } from '../../../api/template';
import { saveMeme } from '../../../api/meme';
import { saveDraft } from '../../../api/draft';
import { cacheMeme } from '../../../slices/serverSlice';

export const defaultMemeProps = {
  name: 'myMeme',
  description: 'A funny meme',
  content: '',
  format: '',
  usedTemplateId: '',
  privacy: "public"
}


const EditorContainer = () => {
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [draftProps, setDraftProps] = useState(null)
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // get draft id from url
    const location = useLocation();
    const draftId = location.pathname.split('/').pop();
    
    const storeTemplates = useSelector((state) => state.template);
    const serverReachable = useSelector((state) => state.server.serverReachable);
    const token = useSelector((state) => state.user.token);
    const drafts = useSelector((state) => state.draft.drafts);
    if(token && !storeTemplates.templatesLoaded) {
      dispatch(getTemplates(token))
    }

    // find the template that has been used with the draft and set it as selected template
    useEffect(() => {
      if(draftId) {
        const draft = drafts.find(draft => draft._id === draftId)
        if(draft) {
          setDraftProps({name: draft.name, textProperties: draft.textProperties})
          const usedTemplate = storeTemplates.templates.find(template => template._id === draft.usedTemplate)
          if(usedTemplate) {
            setSelectedTemplate(usedTemplate)
          }
        }
      }
    }, [draftId])


    const handleSaveMeme = (content, name, description, privacy) => {
      const meme = {
        ...defaultMemeProps,
        name: name,
        description: description,
        format: selectedTemplate.format,
        templateId: selectedTemplate._id,
        privacy: privacy,
        content: content,
      }
      if(serverReachable) {
        console.log("Sending meme to server")
        saveMeme(meme, token)
        .then((response) => {
          console.log("response")
          console.log(response)
            console.log("Meme saved successfully")
            if(response?.memes.length > 0) {
              navigate(`/meme/${response.memes[0]._id}`)
            }
        })
      } else {
        // WORK IN PROGRESS
        //console.log("Storing meme in redux store")
        //dispatch(cacheMeme(meme))
      }
    }

    const handleSaveDraft = (textProperties, name) => {
      const completeDraft = {
        textProperties: textProperties,
        name: name,
        templateId: selectedTemplate._id,
        format: selectedTemplate.format,
      }
      if(serverReachable) {
        dispatch(saveDraft(completeDraft, token, navigate))
      } else {
        alert("You are offline. You can't save drafts while being offline.")
      }
    }

    return (
      <Editor 
        templates={storeTemplates.templates} 
        selectedTemplate={selectedTemplate} 
        setSelectedTemplate={setSelectedTemplate}
        handleSaveMeme={handleSaveMeme}
        handleSaveDraft={handleSaveDraft}
        draftProps={draftProps}
      />
    )

}

export default EditorContainer;