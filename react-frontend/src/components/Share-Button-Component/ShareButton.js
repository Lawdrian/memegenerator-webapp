import React from "react";
import { Button } from "@mui/material";

const ShareButton = ({ memeLink }) => {
    const buttonStyle = {
        width: "20px",
        height: "20px",
    };

    const handleShare = () => {
        navigator.clipboard.writeText(memeLink).then(() => {
            alert("Link copied!");
        }, (err) => {
            console.error('An Error occurred during the copy', err);
        });
    }

    return (
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button onClick={handleShare} variant="contained" style={buttonStyle}>
                Share
            </Button>
        </div>
    );
};

export default ShareButton;
