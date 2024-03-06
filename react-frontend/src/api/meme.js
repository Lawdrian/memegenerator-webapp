import { SERVER_DOMAIN } from '../utils/authUtils';

export function saveMeme(meme, token) {

  return fetch(`${SERVER_DOMAIN}:3000/meme`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",        
      "Authorization": "Bearer " + token, // set token as header
    },
    body: JSON.stringify({                // converts base64-decoded String in JSON
      data: [{
      name: meme.name,
      description: meme.description,
      format: meme.format,
      templateId: meme.templateId,
      privacy: meme.privacy,
      content: meme.content 
    }]                 
    })
  })
  .then((res) => {
    if (res.status === 201) {
      alert("Meme saved successfully")   
      return res.json(); // Resolve with the JSON data if the status is 201
    } else if (res.status === 401) {
      alert("Unauthorized")
    } else {
      alert("Error during Meme save")
    }
  })
  .catch((error) => {
    console.error('Error uploading image:', error)
    alert("Error during Meme save")
  })
}

export function getAllMemes(callBack, token) {
  fetch(`${SERVER_DOMAIN}:3000/meme`, {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
          "Authorization": "Bearer " + token,
      },
  })
  .then((res) => {
    if (!res.ok) {
      throw new Error(res.statusText);
    }
    return res.json();
  })
  .then((data) => {
    callBack(data.memes || []);
  })
  .catch((error) => {
    console.error('Error:', error);
  });
}


export function getSelfCreatedMemes(callBack, token) {
  fetch(`${SERVER_DOMAIN}:3000/meme/mine`, {
      method: 'GET',
      headers: {
          "Authorization": "Bearer " + token, 
          'Content-Type': 'application/json',
      },
  })
  .then((res) => res.json())
  .then((data) => {
      callBack(data.memes || []);
  });
}


export function changeMemePrivacy(privacy, memeId, token){
  fetch(`${SERVER_DOMAIN}:3000/meme/privacy`, {
      method:"PUT",
      headers:{
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token,
      },
      body: JSON.stringify({privacy: privacy, memeId: memeId})
      })
}

export async function handleCommentSubmit(meme, commentContent, token) {
  
  const response = await fetch(`${SERVER_DOMAIN}:3000/meme/comment`, {
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json'
    },
    method: "PUT",
    body: JSON.stringify({
      memeId: meme._id,
      comment: commentContent,
    })
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return await response.json();
}


export function handleUpVote(memeId, token) {
  return fetch(`${SERVER_DOMAIN}:3000/meme/vote`, {
      method: 'PUT',
      headers: {
          "Authorization": "Bearer " + token,
          'Content-Type': 'application/json'
      }, 
      body: JSON.stringify({
          memeId: memeId,
          vote: "upVotes",
      })
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Failed to upvote meme');
    }
    return response.json(); 
  });
}

export function handleDownVote(memeId, token) {
  return fetch(`${SERVER_DOMAIN}:3000/meme/vote`, {
      method: 'PUT',
      headers: {
          "Authorization": "Bearer " + token,
          'Content-Type': 'application/json'
      }, 
      body: JSON.stringify({
          memeId: memeId,
          vote: "downVotes",
      })
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Failed to downvote meme');
    }
    return response.json(); 
  });
}