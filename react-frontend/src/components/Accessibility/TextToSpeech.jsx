import React, { useState } from 'react';
import { Button, Grid, Popover, Paper } from '@mui/material';

export default function TextToSpeech() {
    const [speaking, setSpeaking] = useState(false);
    const [volume, setVolume] = useState(1);
    const [rate, setRate] = useState(0.65);
    const [hover, setHover] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    let speech;

    function handleTextToSpeech() {
        if ('speechSynthesis' in window) {
            if (speaking) {
                window.speechSynthesis.cancel();
                setSpeaking(false);
            } else {
                speech = createSpeechInstance();
                window.speechSynthesis.speak(speech);
                setSpeaking(true);
                console.log('Text to speech started');
            }
        }
    }

    function createSpeechInstance() {
        const newSpeech = new SpeechSynthesisUtterance();
        newSpeech.text = document.body.textContent;
        newSpeech.volume = volume;
        newSpeech.rate = rate;
        newSpeech.pitch = 1;

        newSpeech.onend = () => {
            setSpeaking(false);
        };

        return newSpeech;
    }


    function handleVolume(bool) {
        let newVolume = bool ? volume + 0.2 : volume - 0.2;
        newVolume = Math.max(0, Math.min(1, newVolume));
        setVolume(newVolume);

        window.speechSynthesis.cancel();
        speech = createSpeechInstance();
        window.speechSynthesis.speak(speech);

    }

    function handleRate(bool) {
        let newRate = bool ? rate + 0.2 : rate - 0.2;
        newRate = Math.max(0, Math.min(1, newRate));
        setRate(newRate);

        window.speechSynthesis.cancel();
        speech = createSpeechInstance();
        window.speechSynthesis.speak(speech);
    }
    return (
        <Grid style={{ flexGrow: 1 }}>
            <Grid style = {{display:"flex", flexDirection:"column", width: "200px"}}>
            <Button 
            color="warning" 
            variant="contained" 
            onClick={handleTextToSpeech} 
            ref = {(button) => setAnchorEl(button)}
            style = {{zIndex:1}}
            > 
                {speaking ? 'Stop Reading' : 'Read Content'}
            </Button>
            {speaking && <p style = {{height:"10px", width: "100%", margin:1, padding:0, textAlign:"center"}} onMouseEnter={() => {setHover(true)}}> Einstellungen </p>}
            </Grid>

            

            <Popover
                open={speaking && hover}
                anchorEl={anchorEl} // Useref as  anchorEl
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                close={!hover}
                PaperProps={{ 
                    style: {
                      backgroundColor: "rgba(255, 255, 255, 0.5)",
                      backdropFilter: 'blur(10px)',
                    },
                  }}
                  >
                <Grid container spacing = {2}  onMouseLeave={() => {setHover(false)}}>
                    <Grid item>
                        <p style = {{textAlign:"center"}}>Geschwindigkeit</p>
                        <Button
                            onClick={() => { handleRate(true) }}
                            disabled={rate == 1}
                            variant="contained"
                            style={{ backgroundColor: "green" }}
                        > + </Button>
                        <Button
                            onClick={() => { handleRate(false) }}
                            disabled={rate == 0}
                            variant="contained"
                            style={{ backgroundColor: "red" }}
                        >- </Button>
                    </Grid>
                    <Grid item>
                        <p  style = {{textAlign:"center"}}>Volume</p>
                        <Button
                            onClick={() => { handleVolume(true) }}
                            disabled={volume == 1}
                            variant="contained"
                            style={{ backgroundColor: "green" }}

                        > + </Button>
                        <Button
                            onClick={() => { handleVolume(false) }}
                            disabled={volume == 0}
                            variant="contained"
                            style={{ backgroundColor: "red", width: "10%" }}
                        > - </Button>
                    </Grid>

                </Grid>
            </Popover>
        </Grid>

    );
}


//PROBLEM
/*
Der Button ist niht bedienbar, wenn der Popover offen ist.
darum öffnet sich der popover durch ein.
Zuästzlich ist der backdropfilter nur bei paperprops möglich, nicht sonst oder bei der aktuellen Version <Paper style={{ backdropFilter: 'blur(10px)' }}></Paper>
*/
