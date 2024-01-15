// This file contains the functions that are used to upload and retrieve meme templates from the database

export async function fetchImgflipTemplates() {
  const response = await fetch("https://api.imgflip.com/get_memes");
  const data = await response.json();
  console.log(data);
  return data.data.memes || [];
}


export async function getTemplates() {
  const response = await fetch("http://localhost:3001/template", {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  console.log(data);
  return data.data || [];
}


export function saveTemplate(template, token) {
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
      content: template.content,
      format: template.format,
    })
  })
    .then((res) => res.json())
    .then((data) =>
      console.log(data),
      alert("template saved successfully")
    )
    .catch((error) => console.error('Error saving template to database:', error));
}