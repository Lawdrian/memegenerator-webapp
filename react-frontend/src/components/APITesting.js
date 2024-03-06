import react, {useState, useEffect}  from "react"

import { Grid, Button, Divider } from "@mui/material"
import { useSelector } from "react-redux"

import { getAllMemes } from "../api/meme"
import { formatTime } from "../utils/timeUtils"

import { SERVER_DOMAIN } from "../utils/authUtils"


const APITesting = () => {
  const [memes, setMemes] = react.useState([])
  const [createMemesResponse, setCreateMemesResponse] = react.useState([])
  const [fetchMemesResponse, setFetchMemesRsponse] = react.useState([])
  
  const token = useSelector((state) => state.user.token)
  
  useEffect(() => {
    getAllMemes(setMemes, token)
  }, [])

  const createMemeBatch = async (zip) => {
    setCreateMemesResponse([])

    if(memes.length >= 3) {
      const data = [
        {
          content: memes[0].content,
          name: "meme1",
          description: "This is a test meme",
          format: "image",
          templateId: memes[0].usedTemplate,
          privacy: "public"    
        },
        {
          content: memes[1].content,
          name: "meme2",
          description: "This is a test meme",
          format: "image",
          templateId: memes[1].usedTemplate,
          privacy: "public"      
        },
        {
          content: memes[2].content,
          name: "meme3",
          description: "This is a test meme",
          format: "image",
          templateId: memes[2].usedTemplate,
          privacy: "public"      
        },
      ]              
      
      fetch(`${SERVER_DOMAIN}:3000/meme?zip=${zip}`, {
        method: "POST",
        crossDomain: true,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",        
          "Access-Control-Allow-Origin": "*",  // CORS: Cross-Origin Resource Sharing
          "Authorization": "Bearer " + token, // set token as header
        },
        body: JSON.stringify({                // converts base64-decoded String in JSON
          data: data   
        })
      })
      .then((res) => {
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.indexOf("application/zip") !== -1) {
          return res.blob();
        } else {
          return res.json();
        }
      })
      .then((data) => {
        if (data instanceof Blob) {
          const url = window.URL.createObjectURL(data);
          const link = document.createElement('a');
          link.href = url;
          link.download = 'memes.zip';
          link.click();
        } else {
          setCreateMemesResponse(data.memes);
        }
      })
      .catch((error) => {
        console.error('Test: Error uploading image:', error)
        alert("Test: Error during Meme save")
      });
    }
    else {
      alert("Test: Not enough memes: First create some memes manually!")
    }
  }

  const fetchMemeBatch = async (zip) => {
    setFetchMemesRsponse([])
    fetch(`${SERVER_DOMAIN}:3000/meme?max=3&ordering=asc&format=image&zip=${zip}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            "Authorization": "Bearer " + token,
        },
    })
    .then((res) => {
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.indexOf("application/zip") !== -1) {
        return res.blob();
      } else {
        return res.json();
      }
    })
    .then((data) => {
      if (data instanceof Blob) {
        const url = window.URL.createObjectURL(data);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'memes.zip';
        link.click();
      } else {
        setFetchMemesRsponse(data.memes || []);
      }
    });
  }

  return (
    <Grid container direction="column" spacing={0}>
      <Grid item>
        <h1>API-Test</h1>
      </Grid>
      <Grid item>
        <h2>Create Memes</h2>
        <Button variant="contained" color="primary" onClick={() => createMemeBatch(false)}>
            Create Memes Batch
        </Button>
        <Button variant="contained" color="primary" onClick={() => createMemeBatch(true)} style={{ marginLeft: '10px' }}>
            Response as ZIP
        </Button>
        {createMemesResponse.map((meme, index) => (
          <div key={index}>
            <h2>Name: {meme.name}</h2>
            <img src={meme.content} alt="meme" />
          </div>
        ))}
      </Grid>
      <Grid item>
      <Divider sx={{ height: '4px', backgroundColor: 'black', margin: '20px 0', width: "500px" }} />
      </Grid>
      <Grid item>
        <h2>Fetch Memes</h2>
        <p>Fetch maximum 3 memes with the ordering: oldest first and format: image</p>
        <Button variant="contained" color="primary" onClick={() => fetchMemeBatch(false)}>
            Fetch Memes
        </Button>
        <Button variant="contained" color="primary" onClick={() => fetchMemeBatch(true)} style={{ marginLeft: '10px' }}>
            Response as Zip
        </Button>
        {fetchMemesResponse.map((meme, index) => (
          <div key={index}>
            <h2>Name: {meme.name}</h2>
            <h2>Time: {formatTime(meme.createdAt)}</h2>
            <img src={meme.content} alt="meme" />
          </div>
        ))}
      </Grid>
    </Grid>
  )
}

export default APITesting