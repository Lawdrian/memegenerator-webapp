import { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import { Grid, Button, TextField } from "@mui/material";
import { getAllMemes, handleCommentSubmit, handleDownVote, handleUpVote } from "../api/meme.js";
import "./myMemes.css";
import SingleViewMeme from "./Statistics/SingleViewMeme";

export default function AllMemes() {
    const [allImage, setAllImage] = useState([]);
    const [commentContent, setCommentContent] = useState('');
    const [showStatistics, setShowStatistik] = useState(false);
    const token = useSelector((state) => state.user.token);

    const handleCommentChange = (event) => {
        setCommentContent(event.target.value);
    }

    const handleStatistikClick = (memeId) => {

        const updatedMemes = allImage.map((meme) => {
            if (meme._id === memeId) {
                return { ...meme, showStatistics: !meme.showStatistics };
            }
            return meme;
        });
        setAllImage(updatedMemes);
    };

    useEffect(() => {
        const fetchData = async () => {
            await getAllMemes(setAllImage, token);
        };
        fetchData();
    }, [token]);



    return (
        <Grid style={{ padding: "50px", background: "#DDDDDD44" }}>
            {allImage.map((image) => (
                <Grid style={{ padding: 5 }} key={image._id}>
                    <Grid container>
                        <Grid item xs={12} md={4}>
                            <Grid style={{ display: "flex" }}>
                               <img src={image.content} alt="DAS BILD IST ECHT GEIL FINDET IHR NICHT?" style={{ width: "auto", height: "300px" }} />
                                {image.showStatistics && <SingleViewMeme meme={image} />}
                            </Grid>
                        </Grid>
                        <Grid item xs={12} md={9}>
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
                        <Button onClick={() => handleDownVote(image._id, token)} variant="contained" color="error" style={{ margin: 5 }}>
                            Dislike
                        </Button>
                        <Button onClick={() => handleStatistikClick(image._id)} variant="contained" color="info" style={{ margin: 5 }}>
                            Statistik
                        </Button>
                    </Grid>
                    <Grid container spacing={2} style={{ padding: 20 }}>
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
            ))}
        </Grid>
    );
}
