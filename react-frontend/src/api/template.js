// This file contains the functions that are used to upload and retrieve meme templates from the database
import { setServerNotReachable } from "../slices/serverSlice";
import { setTemplates, setTemplatesLoaded } from "../slices/templateSlice";

export async function fetchImgflipTemplates() {
  const response = await fetch("https://api.imgflip.com/get_memes");
  const data = await response.json();
  console.log(data);
  return data.data.memes || [];
}

// I am using Redux Thunk here -> this function needs to be invoked with dispatch(getTemplates())
export const getTemplates = () => async (dispatch) =>{
  
  try {
    const response = await fetch("http://localhost:3001/template", {
      method: "GET",
    });

    const data = await response.json();
    if(data.data === null) {
      console.error("getTemplates: templates data is empty");
    } else {
      dispatch(setTemplates(data.data || []));
    }
  }
  catch(error){
    console.error("getTemplates: ", error);
    dispatch(setServerNotReachable());
  }
}

// I am using Redux Thunk here -> this function needs to be invoked with dispatch(saveTemplate(template, token))
export const saveTemplate = (template, token) => async (dispatch) => {
  fetch("http://localhost:3001/template", {
    method: "POST",
    crossDomain: true,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",        
      "Access-Control-Allow-Origin": "*",  // CORS: Cross-Origin Resource Sharing
      "Authorization": "Bearer " + token, // set authorization token in header
    },
    body: JSON.stringify({
      name: template.name,
      description: template.description,
      content: template.content,
      format: template.format,
    })
  })
    .then((res) => res.json())
    .then((data) => {
      if(data.error) {
        alert("Error saving template to database")
      } else {
        alert("template saved successfully")
        dispatch(setTemplatesLoaded(false))
      }
  })
    .catch((error) => console.error('Error saving template to database:', error));
}


export async function getTempRefMemes(template) {
  const response = await fetch(`http://localhost:3001/template-info/${template._id}`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  console.log(data.data)
  return data.data || [];
}

