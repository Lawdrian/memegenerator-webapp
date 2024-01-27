export function saveMeme(meme, token) {

  fetch("http://localhost:3001/create-meme", {
    method: "POST",
    crossDomain: true,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",        
      "Access-Control-Allow-Origin": "*",  // CORS: Cross-Origin Resource Sharing
      "Authorization": "Bearer " + token, // set token as header
    },
    body: JSON.stringify({                // converts base64-decoded String in JSON
      content: meme.content,
      name: meme.name,
      format: meme.format,
      templateId: meme.templateId,
      private: meme.private                     
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
  fetch("http://localhost:3001/get-all-memes", {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
          "Authorization": "Bearer " + token,
      },
  })
  .then((res) => res.json())
  .then((data) => {
      callBack(data.memes || []);
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
      body: JSON.stringify({private: privacy, memeId: memeId})
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