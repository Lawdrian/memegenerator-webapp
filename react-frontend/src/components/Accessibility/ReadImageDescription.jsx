import React, { useState, useEffect } from 'react';
import { Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setImageReader } from '../../slices/dictationSlice';
import SpeakText from './SpeakText';
import readImage from './Icon_readImage.png';
import { Icon } from '@mui/material';
import { Grid } from '@mui/material';
export default function ReadImageDescription() {
    const dispatch = useDispatch();
    const imageReader = useSelector((state) => state.dictation.imageReader);
    const [hoveredElement, setHoveredElement] = useState(null);

    function enableReadImage() {
        dispatch(setImageReader(!imageReader));
    }

    useEffect(() => {
        const handleMouseMove = (event) => {
            const hovered = document.elementFromPoint(event.clientX, event.clientY);
            if (hovered && hovered.tagName === 'IMG') {
                setHoveredElement(hovered);
            } else {
                setHoveredElement(null);
            }
        };

        if (imageReader) {
            document.addEventListener('mousemove', handleMouseMove);
        } else {
            document.removeEventListener('mousemove', handleMouseMove);
        }
    }, [imageReader]);




    return (
        <Grid container direction="column" alignItems="center">
            <Icon onClick={enableReadImage} style={{ filter: 'invert(100%)', backgroundImage: `url(${readImage})`, backgroundSize: 'cover', width: 25, height: 25 }} />
            <Button
                style={{ color: "inherit", fontSize: "12px" }}
                onClick={enableReadImage}
            >
                {imageReader ? "Abort Image Reader" : "Image Reader"}
            </Button>
            {hoveredElement && imageReader && (
                <SpeakText text={hoveredElement.alt} />
            )}
        </Grid>
    );
}
