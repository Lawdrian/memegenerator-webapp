import { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import SendIcon from '@mui/icons-material/Send';
import Button from '@mui/material/Button';
import React from "react";
import { Grid } from "@mui/material";

//CSS
import '../uploadTabs/uploadTabs.css';


function ThirdPartyServiceTab() {

  const token = useSelector((state) => state.user.token);
  const [image, setImage] = useState(null); // Setze den Initialwert auf null
  const [allImage, setAllImage] = useState([]); // Setze den Initialwert auf ein leeres Array




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

  function fetchImgflipTemplates(){
    fetch("https://api.imgflip.com/get_memes")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setAllImage(data.data.memes || []);
      });
  };

  useEffect(() => {
    fetchImgflipTemplates();
  }, []);

  return (
    <div className="auth-wrapper">
              <Grid style = {{display:"flex", justifyContent:"center"}}>
                <h1>THIRD PARTY API
                </h1>
                </Grid>
      <Grid container className="auth-inner" style={{ width: "auto", display: "flex", justifyContent:"center", alignItems:"center"}}>
        {allImage.map(template => (
          <img
            key={template.id}
            src={template.url}
            alt={template.name}
            className="img-thumbnail"
            onClick={() => setImage(template.url)
            }
          />
        ))}
        {/* FOR CAMERA FUNCTION */}
        <Grid container>
          <Button
            variant="contained"
            endIcon={<SendIcon />}
            onClick={uploadImage}
          >
            Upload your beauty
          </Button>
        </Grid>
        <Grid>
          {image && ( // Wenn ein Bild vorhanden ist, zeige es an (Kurzschlussauswertung) 
            <div>
              <h2>Preview:</h2>
              console.log(image)
              <img src={image} alt="captured" />
            </div>
          )}
        </Grid>
      </Grid>
    </div>
    )
}

export default ThirdPartyServiceTab;
