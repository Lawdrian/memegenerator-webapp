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

/*

export function retrieveTemplate() {
  fetch("http://localhost:3001/get-image", {
    method: "GET",
  })
    .then((res) => res.json())
    .then((data) => {
      console.group(data);
      setAllImage(data.data || []);  // setzt die Daten aus der Datenbank als state wenn nicht leer
    });
}

export function saveTemplate() {
  fetch("http://localhost:3001/upload", {
    method: "POST",
    crossDomain: true,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",        
      "Access-Control-Allow-Origin": "*",  // CORS: Cross-Origin Resource Sharing
      "Authorization": "Bearer " + token, // Setzt den Token als Header
    },
    body: JSON.stringify({                // Konvertiert den base64-codierten String in JSON
      base64: image                      // Setzt den base64-codierten String als Body
    })
  })
    .then((res) => res.json())
    .then((data) =>
      console.log(data),
      alert("template saved successfully")
    )
    .catch((error) => console.error('Error saving template to database:', error));
}
*/