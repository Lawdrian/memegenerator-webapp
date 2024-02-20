import { useEffect } from "react";
import { useSelector } from 'react-redux';
import { useState } from "react";
import { Typography, Grid, Divider, Button, Modal, Dialog } from "@mui/material";
import { getSelfCreatedMemes } from "../api/meme.js";
import { formatTime } from "../utils/timeUtils.js";
import { changeMemePrivacy } from "../api/meme.js";
import { PrivacyRadioButton } from "./PrivacyRadioButton.js";

//CSS
import "./myMemes.css";

export default function MyMemes() {
  const [myMemes, setMyMemes] = useState([]);
  const [focusMeme, setFocusMeme] = useState(false);

  const [meme, setMeme] = useState(null);

  const token = useSelector((state) => state.user.token);

  useEffect(() => {
    getSelfCreatedMemes(setMyMemes, token);
  }, []);

  return (
    <Grid container direction="column" style={{background: "#DDDDDD44" }}>
      <Grid item>
      <h2 style={{ letterSpacing: "5px", fontWeight: "100", fontSize: "40px" }}> My Memes</h2>
      <Divider />
      </Grid>
      <Grid>
        {myMemes.map((meme, index) => {
          return (
            <Grid item container direction="row" key={index} spacing={2} style={{ margin: 10 }}>
              <Grid item style={{ height: "400px" }}>
                <img
                  className="myMemes"
                  src={meme.content}
                  alt={`name: ${meme.name}, description: ${meme.description}`}
                  onClick={() => setFocusMeme(meme)}
                />
              </Grid>
              <Grid item>
                <p><b>Name:</b> {meme.name}</p>
                <p><b>Description:</b> {meme.description}</p>
                <p><b>Format:</b> {meme.format}</p>
                <p><b>Creation Date:</b> {formatTime(meme.createdAt)}</p>
                <PrivacyRadioButton privacy={meme.privacy} id={meme._id} />
              </Grid>
            </Grid>
          )
        }
        )}
      </Grid>
      <Dialog
        open={focusMeme}
        onClose={() => setFocusMeme(false)}
        style={{
          maxHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backdropFilter: "blur(10px)",
        }}
      >
        <Grid container direction="column" style={{ padding: "20px" }}>
          <Grid item style={{ background: "#FFFFFFF0" }}>
            <img
              className="focusMeme"
              src={focusMeme.content}
              alt="Focused Meme"
            />
            <Divider />
          </Grid>
            
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
      </Dialog>

    </Grid>
  )
}
