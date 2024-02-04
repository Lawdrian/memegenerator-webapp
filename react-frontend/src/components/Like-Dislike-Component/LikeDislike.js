import React, { useState } from "react";
import { Button } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { handleDownVote, handleUpVote } from "../../api/meme";
import { updateLikesDislikes } from "../../slices/memeSlice";


const LikeDislike = ({ memeId }) => {
    const dispatch = useDispatch();
    const token = useSelector((state) => state.user.token);

    

    const handleLike = () => {
        
        handleUpVote(memeId, token).then(({ upVotes, downVotes }) => {
            dispatch(updateLikesDislikes({ memeId, upVotes, downVotes }));
        });
    };
    const handleDislike = () => {
       
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