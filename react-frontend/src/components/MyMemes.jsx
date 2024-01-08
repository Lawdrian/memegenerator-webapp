import { useEffect } from "react";
import { useSelector } from 'react-redux';
import { useState } from "react";
import { Typography, Grid, Divider, Button, Modal} from "@mui/material";

//CSS
import "./myMemes.css";

export default function MyMemes() {
    const [allImage, setAllImage] = useState([]);
    const [focusMeme, setFocusMeme] = useState(false);

    const [meme, setMeme] = useState(null);
    const token = useSelector((state) => state.user.token);


    function getSelfCreatedMemes() {
        fetch("http://localhost:3001/get-my-meme", {
            method: 'GET',
            headers: {
                "Authorization": "Bearer " + token, 
                'Content-Type': 'application/json',
            },
        })
            .then((res) => res.json())
            .then((data) => {
                setAllImage(data.memes || []);
            });

    }

    useEffect(() => {
        getSelfCreatedMemes();
    }, []);


    function covertTobase64(e) {
        var reader = new FileReader();            // Web-API: makes it possible to read aynchronous data from client 
        reader.readAsDataURL(e.target.files[0]);  
        reader.onload = function () {             // onload: called when reading finished  
          setMeme(reader.result);                // set  base64-decoded String as state
        };
        reader.onerror = error => {
          console.log("Error: ", error);
        }
      }

      function saveMeme() {
        fetch("http://localhost:3001/create-meme", {
          method: "POST",
          crossDomain: true,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",        
            "Access-Control-Allow-Origin": "*",  // CORS: Cross-Origin Resource Sharing
            "Authorization": "Bearer " + token, // set token as header
          },
          body: JSON.stringify({                // converts base64-decoded String in JSON
            base64: meme                     
          })
        })
          .then((res) => res.json())
          .then((data) =>
            console.log(data),
            alert("meme Uploaded Successfully")
          )
          .catch((error) => console.error('Error uploading image:', error));
      }

    function handleOnClick(privacy){
        console.log(focusMeme._id)
        fetch("http://localhost:3001/update-meme-privacy", {
            method:"PUT",
            headers:{
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token,
            },
            body: JSON.stringify({private: privacy, memeId: focusMeme._id})
            })
    }

    return (
        <Grid style = {{padding: "50px", background:"#DDDDDD44"}}>
            <h1 style = {{letterSpacing:"5px", fontWeight:"100", fontSize:"40px"}}> MEINE MEMES</h1>
            <Divider />
            <br />
            <input
                accept="image/*"
                type="file"
                onChange={covertTobase64}
            />
            <Button variant="contained" color="primary" onClick={saveMeme}>
                Upload Meme
            </Button>
            <br/>

            <Grid>
                {allImage.map((data) => {
                    return (
                        <Grid style={{margin: 10 }}>
                            <Grid style = {{height:"400px"}}>
                                <img
                                    className="myMemes"
                                    src={data.image}
                                    onClick={() => setFocusMeme(data)}
                                />
                                <Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    )
                }
                )}
            </Grid>
            <Modal
                open={focusMeme}
                onClose={() => setFocusMeme(false)}
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backdropFilter: "blur(10px)",
                  }}
                              >
                <Grid style = {{background:"#FFFFFFF0"}}>
                    <img
                        className="focusMeme"
                        src={focusMeme.image}
                        alt="Focused Meme"
                        onClick={handleOnClick}
                    />
                    <Divider />
                    <Grid container>
                        <Grid item xs={12} style={{ margin: "20px" }}>
                            <Typography variant="h6">SICHTBARKEIT</Typography>
                            <br />
                            <Button variant="contained" onClick={() => handleOnClick(0)} style={{ width: "15%" }}>
                                Privat</Button>
                            <br />
                            <Button variant="contained" onClick={() => handleOnClick(1)} style={{ width: "15%", marginTop: "20px" }}>
                                Öffentlich</Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Modal>

        </Grid>
    )
}
