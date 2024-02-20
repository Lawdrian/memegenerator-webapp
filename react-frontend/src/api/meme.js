export function saveMeme(meme, token) {

  fetch("http://localhost:3001/meme", {
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
    console.log("response")
    console.log(res)
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
  fetch("http://localhost:3001/meme", {
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
  fetch("http://localhost:3001/get-my-meme", {
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
  console.log(memeId)
  fetch("http://localhost:3001/update-meme-privacy", {
      method:"PUT",
      headers:{
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token,
      },
      body: JSON.stringify({privacy: privacy, memeId: memeId})
      })
}

export function handleCommentSubmit(meme, commentContent, token) {
  console.log(commentContent);
  fetch('http://localhost:3001/meme-comment', {
      headers:{
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json'
      },
      method: "PUT",
      body: JSON.stringify({
          memeId: meme._id,
          comment: commentContent,
      })
  })
};

export function handleUpVote(memeId, token){
  fetch('http://localhost:3001/meme-vote', {
      headers: {
          "Authorization": "Bearer " + token,
          'Content-Type': 'application/json'
      }, 
      method: 'PUT',
      body: JSON.stringify({
          memeId: memeId,
          vote: "upVotes",
      })
  });
}

export function handleDownVote(memeId, token){
  fetch('http://localhost:3001/meme-vote', {
      headers: {
          "Authorization": "Bearer " + token,
          'Content-Type': 'application/json'
      }, 
      method: 'PUT',
      body: JSON.stringify({
          memeId: memeId,
          vote: "downVotes",
      })
  });
}