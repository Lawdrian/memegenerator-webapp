import React, { useState, useEffect } from 'react';
import {retrieveGifFrames, makeGif} from "../../../api/createGif"
import { Button } from '@mui/material';

const GifDisplay = () => {
    const [gifData, setGifData] = useState(null);
    const [finalGif, setFinalGif] = useState(null);

    useEffect(() => {
        const fetchGifData = async () => {
            const data = await retrieveGifFrames();
            console.log("GifDisplay" + data)
            setGifData(data);
        };

        fetchGifData();
    }, []);

    const handleClick = async () => {
        const data = await makeGif(gifData, "Hello World", "fade-out");
        console.log("GifDisplay" + data)
        setFinalGif(data);
    }


    if (!gifData) {
        return <div>Loading...</div>;
    }

    if (finalGif) {
      return (
        <div>
          <div className="gif-display">
              <img src={`data:image/gif;base64,${finalGif}`} alt="gif" />
          </div>
        </div>
      );
    }

    return (
      <div>
        <div className="gif-display">
            <img src={`data:image/gif;base64,${gifData[1]}`} alt="gif" />
        </div>
        <Button onClick={() => handleClick()}>Click</Button>
      </div>
    );
}

export default GifDisplay;