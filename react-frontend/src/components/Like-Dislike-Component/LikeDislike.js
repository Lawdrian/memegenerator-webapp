import React, { useState } from "react";
import { Button } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { handleDownVote, handleUpVote } from "../../api/meme";
import { updateLikesDislikes } from "../../slices/memeSlice";


const LikeDislike = ({ memeId }) => {
    const dispatch = useDispatch();
    const token = useSelector((state) => state.user.token);

    // Lokaler State für die Anzeige der Likes und Dislikes
    const [likes, setLikes] = useState(memeId.upVotes.length);
    const [dislikes, setDislikes] = useState(memeId.downVotes.length);

    const handleLike = () => {
        // Rufe die API auf und aktualisiere die Likes im Backend.
        // Dann rufe die updateLikesDislikes-Aktion auf, um den Redux-Store zu aktualisieren.
        handleUpVote(memeId, token).then(({ upVotes, downVotes }) => {
            dispatch(updateLikesDislikes({ memeId, upVotes, downVotes }));
        });
    };
    const handleDislike = () => {
        // Rufe die API auf und aktualisiere die Dislikes im Backend.
        // Dann rufe die updateLikesDislikes-Aktion auf, um den Redux-Store zu aktualisieren.
        handleDownVote(memeId, token).then(({ upVotes, downVotes }) => {
            dispatch(updateLikesDislikes({ memeId, upVotes, downVotes }));
        });
    };

    return (
        <div>
            <Button onClick={handleLike} variant="contained" color="success">
                Like ({memeId.upVotes.length})
            </Button>
            <Button onClick={handleDislike} variant="contained" color="error">
                Dislike ({memeId.downVotes.length})
            </Button>
        </div>
    );
};

export default LikeDislike;