import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getSingleMeme, handleCommentSubmit, voteMeme } from "../../api/meme";
import { updateLikesDislikes } from "../../slices/memeSlice";
import { Button, TextField } from "@mui/material";
import "./SingleView.css";

const SingleView = () => {
  const { id } = useParams();
  const allMemes = useSelector((state) => state.meme.memes);
  const token = useSelector((state) => state.user.token);
  const dispatch = useDispatch();

  const [currentMemeIndex, setCurrentMemeIndex] = useState(0);
  const [autoPlayInterval, setAutoPlayInterval] = useState(null);
  const [isAutoPlayActive, setIsAutoPlayActive] = useState(false);
  const [comment, setComment] = useState("");

  useEffect(() => {
    if (token && id) {
      getSingleMeme(id, token)
        .then((memeData) => {
          setCurrentMemeIndex(
            allMemes.findIndex((meme) => meme._id === memeData._id)
          ); // Assuming allMemes contains the meme with this id
        })
        .catch((error) => {
          console.error("Error fetching single meme:", error);
        });
    }
  }, [id, token, allMemes]);

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const handleSubmitComment = () => {
    if (!comment.trim()) return; // Avoid submitting empty comments

    handleCommentSubmit(currentMeme, comment, token)
      .then(() => {
        console.log("Comment submitted successfully");
        setComment(""); // Clear the comment input field
        // Optionally, refresh comments or update the UI here
      })
      .catch((error) => {
        console.error("Error submitting comment:", error);
      });
  };

  const handleArrowClick = (direction) => {
    if (direction === "left") {
      setCurrentMemeIndex((prevIndex) =>
        prevIndex === 0 ? allMemes.length - 1 : prevIndex - 1
      );
    } else if (direction === "right") {
      setCurrentMemeIndex((prevIndex) =>
        prevIndex === allMemes.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  const handleVoteClick = (voteType) => {
    voteMeme(id, voteType, token)
      .then((updatedMeme) => {
        console.log("Meme updated with votes:", updatedMeme);

        // Dispatch the updateLikesDislikes action to update Redux state
        dispatch(
          updateLikesDislikes({
            memeId: id,
            upVotes: updatedMeme.upVotes,
            downVotes: updatedMeme.downVotes,
          })
        );
      })
      .catch((error) => {
        console.error("Error voting for meme:", error);
      });
  };

  const handleRandomClick = () => {
    // Add logic for handling random button click
    // You can generate a random index and set it as the currentMemeIndex
    const randomIndex = Math.floor(Math.random() * allMemes.length);
    setCurrentMemeIndex(randomIndex);
  };

  const handleAutoPlayClick = () => {
    // Toggle auto-play state
    setIsAutoPlayActive((prev) => !prev);

    // Clear existing auto-play interval if any
    clearInterval(autoPlayInterval);

    // If auto-play is active, set a new interval to switch to the next picture every 5 seconds
    if (!isAutoPlayActive) {
      const intervalId = setInterval(() => {
        handleRandomClick();
      }, 5000);

      // Store the interval ID in state to allow clearing it later
      setAutoPlayInterval(intervalId);
    }
  };

  const currentMeme = allMemes[currentMemeIndex];

  if (!currentMeme) {
    return (
      <div className="single-view single-view-empty">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="single-view">
      <div className="single-view-card">
        <div className="single-view-image">
          {currentMeme.content ? (
            <img
              src={currentMeme.content}
              alt={currentMeme.name}
              style={{ maxWidth: "100%", maxHeight: "100%" }}
            />
          ) : (
            <div className="empty-meme">No Image</div>
          )}
        </div>
        <div className="single-view-actions">
          <button
            className="previous-button"
            onClick={() => handleArrowClick("left")}
          >
            previous
          </button>
          <button className="random-button" onClick={handleRandomClick}>
            Random
          </button>
          <button onClick={handleAutoPlayClick}>
            {isAutoPlayActive ? "Stop" : "Auto Play"}
          </button>
          <button
            className="next-button"
            onClick={() => handleArrowClick("right")}
          >
            next
          </button>
          <button
            className="upvote-button"
            onClick={() => handleVoteClick("upVotes")}
          >
            Like <span>({currentMeme.upVotes.length})</span>
          </button>
          <button
            className="downvote-button"
            onClick={() => handleVoteClick("downVotes")}
          >
            Dislike <span>({currentMeme.downVotes.length})</span>
          </button>

          {/* Additional details and functionalities for SingleView */}
        </div>
      </div>
      {/* Comment submission section */}
      <div className="single-view-comment-input">
        <TextField
          fullWidth
          label="Add a comment..."
          variant="outlined"
          value={comment}
          onChange={handleCommentChange}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmitComment}
        >
          Submit
        </Button>
      </div>
      {/* Comments display section */}
      <div className="single-view-comments">
        <h3>Comments:</h3>
        {currentMeme.comments && currentMeme.comments.length > 0 ? (
          currentMeme.comments.map((comment, index) => (
            <div key={index} className="single-view-comment">
              {/* Assuming the user information is populated in the comment.user field */}
              {/* Adjust according to your data structure; you might need to fetch user details separately if not included */}
              <p>
                <strong>{comment.user.email}</strong>: {comment.content}
              </p>
            </div>
          ))
        ) : (
          <p>No comments yet.</p>
        )}
      </div>
    </div>
  );
};

export default SingleView;
