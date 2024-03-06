import { setDrafts, setDraftsLoaded } from "../slices/draftSlice";
import { setUser } from "../slices/userSlice";
import { SERVER_DOMAIN } from "../utils/authUtils";

export const saveDraft = (draft, token, navigate) => async (dispatch) => {
  try {
    const response = await fetch(`${SERVER_DOMAIN}:3001/draft`, {
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
    const response = await fetch(`${SERVER_DOMAIN}:3001/draft`, {
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
      if(data.error === "Token not verified") {
        dispatch(setUser(null));
        setTimeout(() => {
          alert("Token expired, please login again");
        }, 1000);
      } else {
        alert("Error retrieving drafts from database")
      }
    } else {
       dispatch(setDrafts(data.data || []))
    }
  } catch (error) {
    console.error('Error retrieving drafts from database:', error)
  }
}

export const deleteDraft = (draftId, token) => async (dispatch) => {
  try {
    const response = await fetch(`${SERVER_DOMAIN}:3001/draft/${draftId}`, {
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
