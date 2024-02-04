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
    .then((res) => res.json())
    .then((data) =>
      console.log(data),
      alert("meme Uploaded Successfully")
    )
    .catch((error) => console.error('Error uploading image:', error));
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

export function getSingleMeme(memeId, token) {
  return fetch(`http://localhost:3001/api/memes/${memeId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token,
    },
  })
  .then((res) => {
    if (!res.ok) {
      throw new Error('Network response was not ok');
    }
    return res.json();
  })
  .catch((error) => {
    console.error('Error fetching single meme:', error);
    throw error; // Rethrow to allow caller to handle
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

export async function handleCommentSubmit(meme, commentContent, token) {
  console.log(commentContent);
  
  const response = await fetch('http://localhost:3001/meme-comment', {
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

export function voteMeme(memeId, voteType, token) {
  return fetch('http://localhost:3001/meme-vote', {
    method: 'PUT',
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      memeId: memeId,
      vote: voteType,
    }),
  })
  .then((res) => res.json())
  .then((data) => {
    return data;
  })
  .catch((error) => console.error('Error voting for meme:', error));
}