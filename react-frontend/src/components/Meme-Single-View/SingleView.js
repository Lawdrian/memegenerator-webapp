import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Button, TextField, Snackbar } from "@mui/material";
import { updateLikesDislikes, addComment } from "../../slices/memeSlice";
import {
  handleUpVote,
  handleDownVote,
  handleCommentSubmit,
} from "../../api/meme";
import "./SingleView.css";

const SingleView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const allMemes = useSelector((state) => state.meme.memes);
  const token = useSelector((state) => state.user.token);
  const currentUser = useSelector((state) => state.user.currentUser);
  const [autoplay, setAutoplay] = useState(false);
  const [autoplayInterval, setAutoplayInterval] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [comment, setComment] = useState("");

  // Find the meme based on the ID
  const currentMemeIndex = allMemes.findIndex(meme => meme._id === id);
  const currentMeme = allMemes[currentMemeIndex];

  useEffect(() => {
    if (!currentMeme) {
      // Redirect or show an error if the meme is not found
      navigate("/");
    }
  }, [currentMeme, navigate]);

  const navigateToRandomMeme = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * allMemes.length);
    navigate(`/meme/${allMemes[randomIndex]._id}`);
  }, [allMemes, navigate]);

  useEffect(() => {
    if (autoplay) {
      const interval = setInterval(() => {
        navigateToRandomMeme();
      }, 5000); // Wechselt alle 5 Sekunden
      setAutoplayInterval(interval);
      return () => clearInterval(interval);
    } else {
      clearInterval(autoplayInterval);
    }
  }, [autoplay, autoplayInterval, navigateToRandomMeme,allMemes.length]);

  const navigateToNextMeme = () => {
    const nextIndex = (currentMemeIndex + 1) % allMemes.length;
    navigate(`/meme/${allMemes[nextIndex]._id}`);
  };

  const navigateToPreviousMeme = () => {
    const prevIndex = (currentMemeIndex - 1 + allMemes.length) % allMemes.length;
    navigate(`/meme/${allMemes[prevIndex]._id}`);
  };

  

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleShareClick = () => {
    const memeLink = `${window.location.origin}/meme/${currentMeme._id}`;
    navigator.clipboard.writeText(memeLink).then(() => {
      
      setOpenSnackbar(true);
    }).catch(err => {
      console.error('Fehler beim Kopieren des Links:', err);
    });
  };

  const handleVoteClick = async (memeId, voteType) => {
    const updateFunction =
      voteType === "upVotes" ? handleUpVote : handleDownVote;
    try {
      const updatedMeme = await updateFunction(memeId, token);

      dispatch(
        updateLikesDislikes({
          memeId: updatedMeme._id,
          upVotes: updatedMeme.upVotes,
          downVotes: updatedMeme.downVotes,
        })
      );
    } catch (error) {
      console.error("Error updating vote:", error);
    }
  };

  const handleSubmitComment = async () => {
    if (!comment.trim()) return; // Vermeidet das Absenden leerer Kommentare

    try {
      // Ruft die API-Funktion auf und wartet auf die Antwort
      const newCommentResponse = await handleCommentSubmit(
        currentMeme,
        comment,
        token
      );

      // Bereitet den Kommentar für den Redux Store vor, einschließlich Benutzerdaten
      const newComment = {
        ...newCommentResponse, // Nimmt an, dass die API den neuen Kommentar zurückgibt
        user: {
          _id: currentUser._id || "defaultUserId", // Stellt eine Fallback-ID bereit
          email: currentUser.email || "defaultEmail@example.com", // Stellt eine Fallback-E-Mail bereit
        },
        content: comment,
      };

      // Fügt den neuen Kommentar zum Redux Store hinzu
      dispatch(addComment({ memeId: currentMeme._id, comment: newComment }));

      // Löscht das Kommentarfeld
      setComment("");
    } catch (error) {
      console.error("Fehler beim Absenden des Kommentars:", error);
    }
  };

  // Handling navigation to next/previous meme or based on some condition

  if (!currentMeme) {
    return <div>Loading...</div>;
  }

  return (
    <div className="single-view">
      <div className="single-view-content">
        <div className="single-view-comments-container">
          {/* Kommentarfeld und Liste der Kommentare */}
          <TextField
            fullWidth
            label="Add a comment"
            variant="outlined"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <Button onClick={handleSubmitComment}>Submit Comment</Button>
          {currentMeme.comments?.map((comment, index) => (
            <div key={index} className="single-view-comment">
              <p>
                <strong>{comment.user?.email}</strong>: {comment.content}
              </p>
            </div>
          ))}
        </div>{" "}
      </div>
      <div className="single-view-card">
        <h2 className="single-view-title">{currentMeme.name}</h2>
        <p className="single-view-description">{currentMeme.description}</p>
        <div className="single-view-image">
          <img src={currentMeme.content} alt={currentMeme.name} />
        </div>
        <div className="single-view-navigation">
        <button className="nav-button previous-button" onClick={navigateToPreviousMeme}>Previous</button>
        <button className="nav-button next-button" onClick={navigateToNextMeme}>Next</button>
      </div>
        <div className="single-view-actions">
          {/* Buttons for liking, disliking, and commenting */}
          <button
            className="upvote-button"
            onClick={() => handleVoteClick(currentMeme._id, "upVotes")}
          >
            Like <span>({currentMeme.upVotes.length})</span>
          </button>
          <button
            className="downvote-button"
            onClick={() => handleVoteClick(currentMeme._id, "downVotes")}
          >
            Dislike <span>({currentMeme.downVotes.length})</span>
          </button>
          
          <button onClick={navigateToRandomMeme}>Random</button>
          <button onClick={() => setAutoplay(!autoplay)}>
          {autoplay ? "Stop Autoplay" : "Start Autoplay"}
          </button>
          <Button className="singleView-share-button" onClick={handleShareClick}>Share</Button>
          <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message="Meme link copied to clipboard!"
      />
        </div>
      </div>
    </div>
  );
};
export default SingleView;

/*import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { handleCommentSubmit } from "../../api/meme";
import { updateLikesDislikes, addComment } from "../../slices/memeSlice";
import { Button, TextField } from "@mui/material";
import "./SingleView.css";

const SingleView = () => {
  const { id } = useParams();
  const allMemes = useSelector((state) => state.meme.memes);
  const token = useSelector((state) => state.user.token);
  const currentUser = useSelector((state) => state.user.currentUser);
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
      .then((newComment) => {
        console.log("Comment submitted successfully");

        setComment(""); // Clear the comment input field

        const populatedComment = {
          ...newComment,
          user: {
            _id: currentUser._id, // or however you access the current user's id
            email: currentUser.email, // make sure this matches how you store/access user data
          },
          content: comment,
        };

         // Dispatch action to add comment to Redux state, including populated user data
        dispatch(addComment({ memeId: currentMeme._id, comment: populatedComment }));
       
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

          
        </div>
      </div>
     
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
      
      <div className="single-view-comments">
        <h3>Comments:</h3>
        {currentMeme.comments && currentMeme.comments.length > 0 ? (
          currentMeme.comments.map((comment, index) => (
            <div key={index} className="single-view-comment">
             
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

export default SingleView; */
