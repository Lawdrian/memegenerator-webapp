import { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import SendIcon from '@mui/icons-material/Send';
import Button from '@mui/material/Button';

function FileUploadTab() {

  const token = useSelector((state) => state.user.token);
  const [image, setImage] = useState(null); // Setze den Initialwert auf null
  const [allImage, setAllImage] = useState([]); // Setze den Initialwert auf ein leeres Array

  //Konvertierung in base64-codierten String
  function covertTobase64(e) {
    var reader = new FileReader();            // Web-API: ermöglicht asynchron Dateien vom Client zu lesen
    reader.readAsDataURL(e.target.files[0]);  // liest die Datei als URL
    reader.onload = function () {             // onload: wird aufgerufen, wenn  Lesevorgang abgeschlossen 
      setImage(reader.result);                // setzt den base64-codierten String als state
    };
    reader.onerror = error => {
      console.log("Error: ", error);
    }
  }

  function getImage() {
    fetch("http://localhost:3001/get-image", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        console.group(data);
        setAllImage(data.data || []);  // setzt die Daten aus der Datenbank als state wenn nicht leer
      });
  }

  function uploadImage() {
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
        alert("Image Uploaded Successfully")
      )
      .catch((error) => console.error('Error uploading image:', error));
  }

  useEffect(() => {
    getImage();
  }, []);

  return (
    <div className="auth-wrapper">
      <div className="auth-inner" style={{ width: "auto" }}>
        <h1>FILE UPLOAD</h1>
        <input
          accept="image/*"
          type="file"
          onChange={covertTobase64}
        />
        {image == "" || image == null ? "" : <img width={100} height={100} src={image} />}
        <br />
        <br />

        <Button variant="contained" endIcon={<SendIcon />} onClick={uploadImage}>
          Upload
        </Button>

        <br />
        {allImage.map((data) => {
          return (
            <img
              width={100}
              height={100}
              src={data.image}
              style={{
                padding: "20px",
                borderRadius: "8px",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                marginBottom: "20px", // Beispiel für mehr Abstand nach unten
              }}
            />
          )
        }
        )}
      </div>
    </div>
  )

}

export default FileUploadTab;
