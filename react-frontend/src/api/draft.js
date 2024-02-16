import { setDrafts, setDraftsLoaded } from "../slices/draftSlice";

export const saveDraft = (draft, token, navigate) => async (dispatch) => {
  console.log("saving draft")
  try {
    const response = await fetch("http://localhost:3001/draft", {
      method: "POST",
      //crossDomain: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",        
        //"Access-Control-Allow-Origin": "*",  // CORS: Cross-Origin Resource Sharing
        "Authorization": "Bearer " + token, // set authorization token in header
      },
      body: JSON.stringify({
        textProperties: draft.textProperties,
        name: draft.name,
        format: draft.format,
        templateId: draft.templateId,    
      })
    })
    const data = await response.json();
    if(data.error) {
      alert("Error saving draft to database")
    } else {
      alert("draft saved successfully")
      dispatch(setDraftsLoaded(false))
      navigate("/account")
    }
  } catch (error) {
    console.error('Error saving draft to database:', error)
  }
}


export const getDrafts = (token) => async (dispatch) =>{
  try {
    const response = await fetch("http://localhost:3001/draft", {
      method: "GET",
      crossDomain: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",        
        "Access-Control-Allow-Origin": "*",  // CORS: Cross-Origin Resource Sharing
        "Authorization": "Bearer " + token, // set authorization token in header
      },
    })
    const data = await response.json();
    if(data.error) {
      alert("Error retrieving drafts from database")
    } else {
       dispatch(setDrafts(data.data || []))
    }
  } catch (error) {
    console.error('Error retrieving drafts from database:', error)
  }
}

export const deleteDraft = (draftId, token) => async (dispatch) => {
  try {
    const response = await fetch(`http://localhost:3001/draft/${draftId}`, {
      method: "DELETE",
      crossDomain: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",        
        "Access-Control-Allow-Origin": "*",  // CORS: Cross-Origin Resource Sharing
        "Authorization": "Bearer " + token, // set authorization token in header
      },
    })
    const data = await response.json();
    if(data.error) {
      alert("Error deleting draft from database")
    } else {
      alert("draft deleted successfully")
      dispatch(setDraftsLoaded(false))
    }
  } catch (error) {
    console.error('Error deleting draft from database:', error)
  }
}
