// This file contains the functions that are used to upload and retrieve meme templates from the database

// konvert to a base64-String
export function convertToBase64(file) {
  return new Promise((resolve, reject) => {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      resolve(reader.result);
    };
    reader.onerror = error => {
      reject("Error: " + error);
    };
  });
}

export async function convertUrlToBase64(url) {
  const response = await fetch(url);
  const blob = await response.blob();
  return convertToBase64(blob);
}

export async function fetchImgflipTemplates() {
  const response = await fetch("https://api.imgflip.com/get_memes");
  const data = await response.json();
  console.log(data);
  return data.data.memes || [];
}


export async function getTemplates() {
  const response = await fetch("http://localhost:3001/get-templates", {
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
  fetch("http://localhost:3001/save-template", {
    method: "POST",
    crossDomain: true,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",        
      "Access-Control-Allow-Origin": "*",  // CORS: Cross-Origin Resource Sharing
      "Authorization": "Bearer " + token, // Setzt den Token als Header
    },
    body: JSON.stringify({                // Konvertiert den base64-codierten String in JSON
      base64: template                      // Setzt den base64-codierten String als Body
    })
  })
    .then((res) => res.json())
    .then((data) =>
      console.log(data),
      alert("template saved successfully")
    )
    .catch((error) => console.error('Error saving template to database:', error));
}