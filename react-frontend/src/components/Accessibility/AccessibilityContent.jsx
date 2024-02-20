import TextDictation from './TextDictation';
import TextToSpeech from './TextToSpeech';
import ReadImageDescription from './ReadImageDescription';
import { Grid } from '@mui/material';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import Icon from '@mui/material/Icon';

import './accessibilityContent.css';

import Icon_accessibility   from './Icon_accessibility.png';
export default function AccessibilityContent() {
    const [accessibility, setAccessibility] = useState(false);

    return (
        <Grid container justifyContent="center" >
            <Grid item xs={6} style={{ maxWidth: "500px" }} container justifyContent={"center"} >
            <Icon title = "Accessibility" style={{cursor: "pointer", filter: 'invert(100%)', backgroundImage: `url(${Icon_accessibility})`, backgroundSize: 'cover', width: 40, height: 40 }} onClick={() => setAccessibility(!accessibility)} />
                {accessibility && (
                    <Grid container xs={12} justifyContent="center" >
                        <Grid item xs={3} className = "accessibility-icon">
                            <TextDictation />
                        </Grid>
                        <Grid item xs={3}  className = "accessibility-icon">
                            <TextToSpeech />
                        </Grid>
                        <Grid item xs={3}  className = "accessibility-icon">
                            <ReadImageDescription />
                        </Grid>
                    </Grid>
                )}
            </Grid>
        </Grid>
    )
}
