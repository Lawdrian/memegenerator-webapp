import React, { useState, useEffect } from 'react';
import { Button, Grid, Popover, Icon } from '@mui/material';
import readContent from './Icon_readContent.png';

export default function TextToSpeech() {
    const [speaking, setSpeaking] = useState(false);
    const [volume, setVolume] = useState(1);
    const [rate, setRate] = useState(0.65);
    const [hover, setHover] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [voices, setVoices] = useState([]);
    let speech;

    useEffect(() => {
        window.speechSynthesis.onvoiceschanged = () => {
            setVoices(window.speechSynthesis.getVoices());
        };
    }, []);

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
        newSpeech.lang = 'en-US';
        newSpeech.voice = voices[3]; // Use the voices state here

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
        <Grid container direction="column" alignItems="center">
            <Grid container direction="column" alignItems="center">
                <Icon onClick={handleTextToSpeech} style={{ filter: 'invert(100%)', backgroundImage: `url(${readContent})`, backgroundSize: 'cover', width: 25, height: 25 }} />
                <Button
                    color="inherit"
                    onClick={handleTextToSpeech}
                    style={{ zIndex: 1, fontSize: "12px" }}
                    id="readContentBtn"

                >
                    {speaking ? 'Stop Reading' : 'Read Content'}
                </Button>
                {speaking && (
                    <Grid>
                        <span
                            style={{
                                height: "10px",
                                width: "100%",
                                margin: "1px",
                                padding: "0",
                                textAlign: "center"
                            }}
                            ref={(button) => setAnchorEl(button)}

                            onMouseEnter={() => { setHover(true) }}
                        >
                            Einstellungen
                        </span>
                    </Grid>
                )}

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
                <Grid container spacing={2} onMouseLeave={() => { setHover(false) }}>
                    <Grid item>
                        <p style={{ textAlign: "center" }}>Geschwindigkeit</p>
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
                        <p style={{ textAlign: "center" }}>Volume</p>
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

