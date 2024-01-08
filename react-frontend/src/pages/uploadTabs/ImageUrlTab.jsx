import { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';

import SendIcon from '@mui/icons-material/Send';
import Button from '@mui/material/Button';



function ImageUrlTab() {
  const token = useSelector((state) => state.user.token); 
  const [inputUrl, setInputUrl] = useState(""); 
  const [allImage, setAllImage] = useState([]); 
  
  function handleUrlChange(e) {
    setInputUrl(e.target.value);

  }

  function uploadImage() {
    fetch("http://localhost:3001/upload", {
      method: "POST",
      crossDomain: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",        
        "Access-Control-Allow-Origin": "*",  
        "Authorization": "Bearer " + token, 
      },
      body: JSON.stringify({                
        base64: inputUrl                   
      })
    })
      .then((res) => res.json())
      .then((data) =>
        console.log(data),
        alert("Image Uploaded Successfully")
      )
      .catch((error) => console.error('Error uploading image:', error));
  }


  function getImage() {
    fetch("http://localhost:3001/get-image", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        console.group(data);
        setAllImage(data.data || []); 
      });
  }

  useEffect(() => {
    getImage();
  }, []);
  
  return (
    <div className="auth-wrapper">
<input
        type="text"
        value={inputUrl}
        onChange={handleUrlChange}
        placeholder="Bild-URL eingeben"
      />
      <Button
        variant="contained"
        color="primary"
        endIcon={<SendIcon />}
        onClick={uploadImage}
      >
        Hochladen
      </Button>


     {/* Optional: Zeige das hochgeladene Bild an */}
      {inputUrl && (
        <div>
          <p>Hochgeladenes Bild:</p>
          <img src={inputUrl} alt="Hochgeladenes Bild" />
        </div>
      )}


      <div>
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
                marginBottom: "20px", 
              }}
            />
          )
        }
        )}
      </div>

    </div>
  )

}

export default ImageUrlTab;
