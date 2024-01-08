import { useEffect } from "react";
import { useSelector } from 'react-redux';
import { useState } from "react";
import { Grid,Button, TextField} from "@mui/material";

//CSS
import "./myMemes.css";

export default function MyMemes() {
    const [allImage, setAllImage] = useState([]);
    const [focusMeme, setFocusMeme] = useState(false);
    const [commentContent, setCommentContent] = useState('');

    const [meme, setMeme] = useState(null);
    const token = useSelector((state) => state.user.token);

    function handleCommentChange(event) {
        setCommentContent(event.target.value);
    }
    function handleCommentSubmit(image) {
        console.log(commentContent);
        fetch('http://localhost:3001/meme-comment', {
            headers:{
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            },
            method: "PUT",
            body: JSON.stringify({
                memeId: image._id,
                comment: commentContent,
            })
        })
    };

    function getAllmemes() {
        fetch("http://localhost:3001/get-all-memes", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + token,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                setAllImage(data.memes || []);
            });

    }

    useEffect(() => {
        getAllmemes();
    }, []);

//HANDLERS
function handleUpVote(memeID){
    fetch('http://localhost:3001/meme-vote', {
        headers: {
            "Authorization": "Bearer " + token,
            'Content-Type': 'application/json'
        }, 
        method: 'PUT',
        body: JSON.stringify({
            memeId: memeID,
            vote: "upVotes",
        })
    });
}
function handleDownVote(memeID){
    fetch('http://localhost:3001/meme-vote', {
        headers: {
            "Authorization": "Bearer " + token,
            'Content-Type': 'application/json'
        }, 
        method: 'PUT',
        body: JSON.stringify({
            memeId: memeID,
            vote: "downVotes",
        })
    });
}

    return (
        <Grid style = {{padding: "50px", background:"#DDDDDD44"}}>
            {setAllImage && allImage.map((image)=> {
                return (
                    <Grid style = {{padding:5}}>
                        <Grid container>
                            <Grid item xs = {12} md={4}>
                                <img src={image.image} style={{ width: "auto", height: "300px" }} />
                            </Grid>
                            <Grid item xs = {12} md={9} >
                                {image.comments && image.comments.length > 0 && (
                                    <>
                                        {image.comments.map((comment, index) => (
                                            <div key={index}>
                                                <p>{comment.user.email}: {comment.content}</p>
                                            </div>
                                        ))}
                                    </>
                                )}

                            </Grid>

                        </Grid>
                        <Grid container>
                            <Button onClick={() => handleUpVote(image._id)} variant="contained" color="success" style={{ margin: 5 }}>
                                Like
                            </Button>
                            <Button onClick={() => handleDownVote(image._id)} variant="contained" color="error"  style = {{margin:5}}>
                                Dislike
                            </Button>
                        </Grid>
                        <Grid container spacing={2} style ={{padding:20}}>
                            <Grid item xs={8}>
                                <TextField
                                    fullWidth
                                    label="Dein Kommentar"
                                    variant="outlined"
                                    onChange={handleCommentChange}
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <Button variant="contained" color="primary" onClick={() => handleCommentSubmit(image)}>
                                    Senden
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                )
            })}
        </Grid>
    )
}
