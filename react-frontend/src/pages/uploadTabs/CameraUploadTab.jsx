import { useState } from "react";
import { useSelector } from 'react-redux';
import SendIcon from '@mui/icons-material/Send';
import Button from '@mui/material/Button';

import Webcam from "react-webcam"; // FOR CAMERA FUNCTION: import the webcam component
import React from "react";
import { Grid } from "@mui/material";

function CameraUploadTab() {

  const token = useSelector((state) => state.user.token);
  const [image, setImage] = useState(null); 
  const [setAllImage] = useState([]); 

  const webcamRef = React.useRef(null); //FOR CAMERA FUNCTION: referenze to the webcam

  function capture(){
    const imageSrc = webcamRef.current.getScreenshot(); // FOR CAMERA FUNCTION: get the image out of webcam
    setImage(imageSrc); 
    setAllImage((prevImages) => [...prevImages, imageSrc]); 
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
        base64: image               
      })
    })
      .then((res) => res.json())
      .then((data) =>
        console.log(data),
        alert("Image Uploaded Successfully")
      )
      .catch((error) => console.error('Error uploading image:', error));
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-inner" style={{ width: "auto" }}>
        <h1>CAMERA UPLOAD</h1>

              {/* FOR CAMERA FUNCTION */}
                <Grid container display={"flex"} justifyContent={"center"} alignItems={"center"}>
                    <Webcam
                        audio={false}
                        height={480}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        width={640}
                    />

                    <Grid container display={"flex"} justifyContent={"center"} alignItems={"center"} padding={"20px"}>
                        <Grid item xs={6} display={"flex"} justifyContent={"center"} alignItems={"center"}>
                            <Button
                                variant="contained"
                                endIcon={<SendIcon />}
                                onClick={capture}
                            >
                                Capture your beauty
                            </Button>
                        </Grid>
                        <Grid item xs={6} display={"flex"} justifyContent={"center"} alignItems={"center"}>
                            <Button
                                variant="contained"
                                endIcon={<SendIcon />}
                                onClick={uploadImage}
                            >
                                Upload your beauty
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>


                {image && (  
                    <div>
                        <h2>Preview:</h2>
                        <img src={image} alt="captured" />
                    </div>
                )}
                <br />
            </div>
        </div>
    )
}

export default CameraUploadTab;
