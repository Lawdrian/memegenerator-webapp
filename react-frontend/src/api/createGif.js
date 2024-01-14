
export async function createGif(gifBase64) {
  const response = await fetch("http://localhost:3001/add-text-to-gif", {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
  },
  body: JSON.stringify({
      gifBase64: gifBase64, // The base64 representation of your GIF
      text: 'Your Text', // The text to be added
      textProperties: { // The properties of the text
          size: 30, // The size of the text
          color: 'red', // The color of the text
          x: 50, // The x-coordinate of the text
          y: 50 // The y-coordinate of the text
      }
  })
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  console.log(data);
  return data.data || [];
}


export async function retrieveGifFrames() {
  const response = await fetch("http://localhost:3001/gif-to-imagedata", {
    method: "GET",
    headers: {
      'Content-Type': 'application/json'
  },
});

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  console.log(data);
  return data.frames || [];
}

export async function makeGif(images, text, animationType) {
  const response = await fetch("http://localhost:3001/create-gif", {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
  },
  body: JSON.stringify({
      images: images, // The base64 representation of your GIF
      text: text, // The text to be added
      animationType: animationType,
      textProperties: { // The properties of the text
          size: 30, // The size of the text
          color: 'red', // The color of the text
          x: 50, // The x-coordinate of the text
          y: 50 // The y-coordinate of the text
      }
  })
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  console.log(data);
  return data.data || [];
}