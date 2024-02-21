import TextDictation from './TextDictation';
import TextToSpeech from './TextToSpeech';
import ReadImageDescription from './ReadImageDescription';
import { Grid } from '@mui/material';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import Icon from '@mui/material/Icon';

import image from './Icon_accessibility.png';
import './accessibilityContent.css';

import Icon_accessibility from './Icon_accessibility.png';
export default function AccessibilityContent() {
    const [accessibility, setAccessibility] = useState(false);

    return (
        <Grid container justifyContent="center" alignItems="center" direction="row">
            <Grid item style={{ maxWidth: "1000px" }} container justifyContent={"center"} >
                <Grid item >
                    <Icon title="Accessibility" style={{ cursor: "pointer", filter: accessibility ? 'invert(0%)' : 'invert(100%)', backgroundImage: `url(${Icon_accessibility})`, backgroundSize: 'cover', width: 40, height: 40 }} onClick={() => setAccessibility(!accessibility)} />
                </Grid>
                {accessibility && (
                <Grid item xs={3}>
                <Grid container justifyContent="center" >
                            <Grid item xs={4} className="accessibility-icon">
                                <TextDictation />
                            </Grid>
                            <Grid item xs={4} className="accessibility-icon">
                                <TextToSpeech />
                            </Grid>
                            <Grid item xs={4} className="accessibility-icon">
                                <ReadImageDescription />
                            </Grid>
                        </Grid>
                    </Grid>
                )}
            </Grid>
        </Grid>
    )
}
