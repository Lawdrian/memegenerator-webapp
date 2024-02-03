import { useEffect } from "react";
import { useSelector } from 'react-redux';
import { useState } from "react";
import { Typography, Grid, Divider, Button, Modal} from "@mui/material";
import { getSelfCreatedMemes, saveMeme } from "../api/meme.js";
import { convertToBase64 } from "../utils/base64Conversions.js";
import { changeMemePrivacy } from "../api/meme.js";

//CSS
import "./myMemes.css";

export default function MyMemes() {
    const [allImage, setAllImage] = useState([]);
    const [focusMeme, setFocusMeme] = useState(false);

    const token = useSelector((state) => state.user.token);

    useEffect(() => {
        getSelfCreatedMemes(setAllImage, token);
    }, []);

    return (
        <Grid style = {{padding: "50px", background:"#DDDDDD44"}}>
            <h1 style = {{letterSpacing:"5px", fontWeight:"100", fontSize:"40px"}}> MEINE MEMES</h1>
            <Divider />
            <br />
            <Grid>
                {allImage.map((data, index) => {
                    return (
                        <Grid key={index} style={{margin: 10 }}>
                            <Grid style = {{height:"400px"}}>
                                <img
                                    className="myMemes"
                                    src={data.content}
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
                        src={focusMeme.content}
                        alt="Focused Meme"
                    />
                    <Divider />
                    <Grid container>
                        <Grid item xs={12} style={{ margin: "20px" }}>
                            <Typography variant="h6">SICHTBARKEIT</Typography>
                            <br />
                            <Button variant="contained" onClick={() => changeMemePrivacy("private", focusMeme._id, token)} style={{ width: "15%" }}>
                                private
                            </Button>
                            <br />
                            <Button variant="contained" onClick={() => changeMemePrivacy("public", focusMeme._id, token)} style={{ width: "15%", marginTop: "20px" }}>
                                public
                            </Button>
                            <br />
                            <Button variant="contained" onClick={() => changeMemePrivacy("unlisted", focusMeme._id, token)} style={{ width: "15%", marginTop: "20px" }}>
                                unlisted
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Modal>

        </Grid>
    )
}
