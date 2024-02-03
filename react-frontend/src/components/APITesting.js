import react, {useState, useEffect}  from "react"

import { Grid, Button, Divider } from "@mui/material"
import { useSelector } from "react-redux"

import { getAllMemes } from "../api/meme"
import { formatTime } from "../utils/timeUtils"


const APITesting = () => {
  const [memes, setMemes] = react.useState([])
  const [createMemesResponse, setCreateMemesResponse] = react.useState([])
  const [fetchMemesResponse, setFetchMemesRsponse] = react.useState([])
  
  const token = useSelector((state) => state.user.token)
  
  useEffect(() => {
    getAllMemes(setMemes, token)
  }, [])

  const createMemeBatch = async () => {
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
      
      fetch("http://localhost:3001/meme", {
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
        console.log("response")
        console.log(res)
        if (res.status === 201) {
          alert("Test: Meme saved successfully")      
          return res.json(); // Resolve with the JSON data if the status is 201
        } else if (res.status === 401) {
          alert("Test: Unauthorized")
        } else {
          alert("Test: Error during Meme save")
        }
      })
      .then((data) => {
        setCreateMemesResponse(data.memes)
      })
      .catch((error) => {
        console.error('Test: Error uploading image:', error)
        alert("Test: Error during Meme save")
      })
    }
    else {
      alert("Test: Not enough memes: First create some memes manually!")
    }
  }

  const fetchMemeBatch = async () => {
    setFetchMemesRsponse([])
    fetch("http://localhost:3001/meme?max=3&ordering=asc&format=image", {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            "Authorization": "Bearer " + token,
        },
    })
    .then((res) => res.json())
    .then((data) => {
        setFetchMemesRsponse(data.memes || []);
    });
  }

  return (
    <Grid container direction="column" spacing={0}>
      <Grid item>
        <h1>API-Test</h1>
      </Grid>
      <Grid item>
        <h2>Create Memes</h2>
        <Button variant="contained" color="primary" onClick={createMemeBatch}>
            Create Memes Batch
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
        <Button variant="contained" color="primary" onClick={fetchMemeBatch}>
            Fetch Memes
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