import { useEffect, useState, useRef } from "react";
import { useSelector } from 'react-redux';
import SendIcon from '@mui/icons-material/Send';
import Button from '@mui/material/Button';
import React from "react";
import { Grid } from "@mui/material";

//CSS
import '../uploadTabs/uploadTabs.css';

function HandDrawnTab() {
  const token = useSelector((state) => state.user.token);
  const [image, setImage] = useState(null);
  const [allImage, setAllImage] = useState([]);
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    fetchImgflipTemplates();
  }, []);

  function fetchImgflipTemplates() {
    fetch("https://api.imgflip.com/get_memes")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setAllImage(data.data.memes || []);
      });
  }

  function handleCanvasMouseDown() {
    setIsDrawing(true);
  }

  function handleCanvasMouseUp() {
    setIsDrawing(false);
  }

  function handleCanvasMouseMove(event) {
    if (!isDrawing) return;
    const ctx = canvasRef.current.getContext("2d");
    const x = event.nativeEvent.offsetX;
    const y = event.nativeEvent.offsetY;

    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#000"; 

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  }

  function clearCanvas() {
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  }

  function uploadImage() {
    const canvasDataURL = canvasRef.current.toDataURL("image/png");
    fetch("http://localhost:3001/upload", {
      method: "POST",
      crossDomain: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        base64: canvasDataURL,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        alert("Image Uploaded Successfully");
      })
      .catch((error) => console.error("Error uploading image:", error));
  }

  return (
    <div className="auth-wrapper">
      <Grid style={{ display: "flex", justifyContent: "center" }}>
        <h1>Draw and share your masterpiece</h1>
      </Grid>
      <Grid
        container
        className="auth-inner"
        style={{
          width: "auto",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          style={{ border: "1px solid #000" }}
          onMouseDown={handleCanvasMouseDown}
          onMouseUp={handleCanvasMouseUp}
          onMouseMove={handleCanvasMouseMove}
        ></canvas>
        <Button
          variant="contained"
          endIcon={<SendIcon />}
          onClick={uploadImage}
        >
          Upload your beauty
        </Button>
        <Button variant="contained" onClick={clearCanvas}>
          Clear Canvas
        </Button>
      </Grid>
    </div>
  );
}

export default HandDrawnTab;

