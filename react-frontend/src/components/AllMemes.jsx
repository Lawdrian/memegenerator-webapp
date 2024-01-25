import { useEffect } from "react";
import { useSelector } from 'react-redux';
import { useState } from "react";
import { Grid,Button, TextField} from "@mui/material";
import { getAllMemes, handleCommentSubmit, handleDownVote, handleUpVote } from "../api/meme.js";

//CSS
import "./myMemes.css";

export default function AllMemes() {
    const [allImage, setAllImage] = useState([]);
    const [commentContent, setCommentContent] = useState('');

    const token = useSelector((state) => state.user.token);

    function handleCommentChange(event) {
        setCommentContent(event.target.value);
    }

    useEffect(() => {
        getAllMemes(setAllImage, token);
    }, []);



    return (
        <Grid style = {{padding: "50px", background:"#DDDDDD44"}}>
            {setAllImage && allImage.map((image)=> {
                return (
                    <Grid style = {{padding:5}}>
                        <Grid container>
                            <Grid item xs = {12} md={4}>
                                <img src={image.content} style={{ width: "auto", height: "300px" }} />
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
                            <Button onClick={() => handleUpVote(image._id, token)} variant="contained" color="success" style={{ margin: 5 }}>
                                Like
                            </Button>
                            <Button onClick={() => handleDownVote(image._id, token)} variant="contained" color="error"  style = {{margin:5}}>
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
                                <Button variant="contained" color="primary" onClick={() => handleCommentSubmit(image, commentContent, token)}>
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
