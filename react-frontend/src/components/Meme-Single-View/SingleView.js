import React, { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Button, TextField, Snackbar } from "@mui/material";
import {
  updateLikesDislikes,
  addComment,
  setSorting,
  setFiltering,
} from "../../slices/memeSlice";
import SortingFilteringComponent from "../Sorting-Filtering-Component/SortingFiltering";
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
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [comment, setComment] = useState("");

  // State for sorted memes and sorting criteria
  const [sortedMemes, setSortedMemes] = useState([]);
  const [selectedSortCriteria, setSelectedSortCriteria] = useState("");

  // Find the meme based on the ID
  //const currentMemeIndex = allMemes.findIndex((meme) => meme._id === id);
  //const currentMeme = allMemes[currentMemeIndex];

  useEffect(() => {
    const sortMemes = (criteria) => {
      let tempSortedMemes = allMemes.map(meme => ({
        ...meme,
        createdAtTimestamp: new Date(meme.createdAt).getTime()
      }));
      switch (criteria) {
        case "mostLikes":
          tempSortedMemes.sort((a, b) => a.upVotes.length - b.upVotes.length);
          break;
        case "leastLikes":
          tempSortedMemes.sort((a, b) => b.upVotes.length - a.upVotes.length);
          break;
          case "newest":
            tempSortedMemes.sort((a, b) => a.createdAtTimestamp - b.createdAtTimestamp);
            break;
          case "oldest":
            tempSortedMemes.sort((a, b) => b.createdAtTimestamp - a.createdAtTimestamp);
          break;
        default:
          break;
      }
      setSortedMemes(tempSortedMemes);
    };

    

    sortMemes(selectedSortCriteria);
  }, [allMemes, selectedSortCriteria]);

  const handleSortChange = useCallback((newCriteria) => {
    setSelectedSortCriteria(newCriteria);
  }, []);

  // Find the current meme based on the ID
  const currentMeme = allMemes.find((meme) => meme._id === id);

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

  const autoplayIntervalRef = useRef(null); // Verwendung eines Refs anstelle eines State

  useEffect(() => {
    if (autoplay) {
      const interval = setInterval(() => {
        navigateToRandomMeme();
      }, 5000);
      autoplayIntervalRef.current = interval; // Speichern des Interval-Identifiers im Ref
      return () => clearInterval(autoplayIntervalRef.current);
    } else {
      clearInterval(autoplayIntervalRef.current); // Zugriff auf den gespeicherten Wert im Ref
    }
  }, [autoplay, navigateToRandomMeme, allMemes.length]);

  const navigateToNextMeme = () => {
    const currentIndex = sortedMemes.findIndex((meme) => meme._id === id);
    const nextIndex = (currentIndex + 1) % sortedMemes.length;
    if (sortedMemes[nextIndex]) {
      navigate(`/meme/${sortedMemes[nextIndex]._id}`);
    }
  };
  
  const navigateToPreviousMeme = () => {
    const currentIndex = sortedMemes.findIndex((meme) => meme._id === id);
    const prevIndex = (currentIndex - 1 + sortedMemes.length) % sortedMemes.length;
    if (sortedMemes[prevIndex]) {
      navigate(`/meme/${sortedMemes[prevIndex]._id}`);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleShareClick = () => {
    const memeLink = `${window.location.origin}/meme/${currentMeme._id}`;
    navigator.clipboard
      .writeText(memeLink)
      .then(() => {
        setOpenSnackbar(true);
      })
      .catch((err) => {
        console.error("Fehler beim Kopieren des Links:", err);
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
    if (!comment.trim()) return;

    try {
      const newCommentResponse = await handleCommentSubmit(
        currentMeme,
        comment,
        token
      );

      const newComment = {
        ...newCommentResponse,
        user: {
          _id: currentUser._id || "defaultUserId", //  Fallback-ID
          email: currentUser.email || "defaultEmail@example.com", //  Fallback-E-Mail
        },
        content: comment,
      };

      dispatch(addComment({ memeId: currentMeme._id, comment: newComment }));

      setComment("");
    } catch (error) {
      console.error("Fehler beim Absenden des Kommentars:", error);
    }
  };

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
      <SortingFilteringComponent onSortChange={handleSortChange} />
      <div className="single-view-card">
        <h2 className="single-view-title">{currentMeme.name}</h2>
        <p className="single-view-description">{currentMeme.description}</p>
        <div className="single-view-image">
          <img src={currentMeme.content} alt={currentMeme.name} />
        </div>
        <div className="single-view-navigation">
          <button
            className="nav-button previous-button"
            onClick={navigateToPreviousMeme}
          >
            Previous
          </button>
          <button
            className="nav-button next-button"
            onClick={navigateToNextMeme}
          >
            Next
          </button>
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
          <Button
            className="singleView-share-button"
            onClick={handleShareClick}
          >
            Share
          </Button>
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
