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