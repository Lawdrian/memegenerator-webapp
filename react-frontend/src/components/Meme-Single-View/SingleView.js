import React, { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Button, TextField, Snackbar } from "@mui/material";
import {
  updateLikesDislikes,
  addComment,
  fetchAllMemes,
} from "../../slices/memeSlice";
import SortingFilteringComponent from "../Sorting-Filtering-Component/SortingFiltering";
import {
  handleUpVote,
  handleDownVote,
  handleCommentSubmit,
} from "../../api/meme";
import "./SingleView.css";
import SingleViewStatistics from "../Statistics/SingleViewMeme";

const SingleView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const allMemes = useSelector((state) => state.meme.memes);
  const token = useSelector((state) => state.user.token);
  const currentUser = useSelector((state) => state.user.currentUser);
  const memesLoaded = useSelector((state) => state.meme.memesLoaded);

  const [autoplay, setAutoplay] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [comment, setComment] = useState("");

  // State for sorted memes and sorting criteria
  const [sortedMemes, setSortedMemes] = useState([]);
  const [selectedSortCriteria, setSelectedSortCriteria] = useState("");

  const [filterCriteria, setFilterCriteria] = useState("");
  const [filterValue, setFilterValue] = useState("");


  useEffect(() => {
    if (!memesLoaded) {
      dispatch(fetchAllMemes(token));
    }
  }, [dispatch, memesLoaded, token]);

  // find the current meme from the Redux store
  const currentMeme = useSelector((state) =>
    state.meme.memes.find((meme) => meme._id === id)
  );


  // State for meme statistics
  const [openStatistics, setOpenStatistics] = useState(false);

  useEffect(() => {
    // Apply filtering first
    console.log(allMemes)
    let filteredMemes = allMemes.filter((meme) => {
      // Apply filter based on the criteria and value
      switch (filterCriteria) {
        case "title":
          return meme?.name.toLowerCase().includes(filterValue.toLowerCase());
        case "description":
          return meme?.description
            .toLowerCase()
            .includes(filterValue.toLowerCase());
        case "likes":
          const likesCount = parseInt(filterValue, 10);
          // Filter by exact number of likes if a number is provided; otherwise, don't filter
          return !isNaN(likesCount) ? meme?.upVotes.length === likesCount : true;
        case "dislikes":
          const dislikesCount = parseInt(filterValue, 10);
          // Filter by exact number of dislikes if a number is provided; otherwise, don't filter
          return !isNaN(dislikesCount)
            ? meme?.downVotes.length === dislikesCount
            : true;
        case "fileFormat":
          // Assuming all memes are images but checking for the format anyway
          if (filterValue.toLowerCase() === "image") {
            return true; // Shows all memes since they are all images
          } else if (
            filterValue.toLowerCase() === "video" ||
            filterValue.toLowerCase() === "gif"
          ) {
            return false; // Shows nothing for 'video' or 'gif'
          }
        default:
          return true; // If no filter criteria is selected, don't filter out any memes
      }
    });

    // Then apply sorting to the filtered list
    filteredMemes.sort((a, b) => {
      switch (selectedSortCriteria) {
        case "mostLikes":
          return a?.upVotes.length - b?.upVotes.length;
        case "leastLikes":
          return b?.upVotes.length - a?.upVotes.length;
        case "newest":
          // Assuming createdAtTimestamp is a numeric timestamp for simplicity
          return (
            new Date(b?.createdAt).getTime() - new Date(a?.createdAt).getTime()
          );
        case "oldest":
          return (
            new Date(a?.createdAt).getTime() - new Date(b?.createdAt).getTime()
          );
        default:
          return 0; // No sorting applied
      }
    });

    // Update state with the filtered and sorted memes
    setSortedMemes(filteredMemes);
  }, [allMemes, selectedSortCriteria, filterCriteria, filterValue]);

  const handleSortChange = useCallback((newCriteria) => {
    setSelectedSortCriteria(newCriteria);
    // Reset filter criteria and value when sort changes
    setFilterCriteria("");
    setFilterValue("");
  }, []);

  const handleFilterTypeChange = useCallback((newFilterType) => {
    setFilterCriteria(newFilterType);
    // Reset sort criteria when filter changes
    setSelectedSortCriteria("");
  }, []);

  // Function to handle changes in filter value (the actual text or number to filter by
  const handleFilterValueChange = useCallback((newFilterValue) => {
    setFilterValue(newFilterValue);
    // Reset sort criteria when filter changes
    setSelectedSortCriteria("");
  }, []);

  const navigateToRandomMeme = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * allMemes.length);
    navigate(`/meme/${allMemes[randomIndex]._id}`);
  }, [allMemes, navigate]);

  const autoplayIntervalRef = useRef(null);

  useEffect(() => {
    if (autoplay) {
      const interval = setInterval(() => {
        navigateToRandomMeme();
      }, 5000);
      autoplayIntervalRef.current = interval;
      return () => clearInterval(autoplayIntervalRef.current);
    } else {
      clearInterval(autoplayIntervalRef.current);
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
    const prevIndex =
      (currentIndex - 1 + sortedMemes.length) % sortedMemes.length;
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

  const isVisible =
    filterCriteria !== "fileFormat" || filterValue.toLowerCase() === "image";

  return (
    <div className="single-view">
      <SingleViewStatistics meme={currentMeme} open={openStatistics} setOpen={setOpenStatistics}/>
      <div className="single-view-content">
        <div className="single-view-comments-container">
          {/* Comments section */}
          <TextField
            fullWidth
            label="Add a comment"
            variant="outlined"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <Button onClick={handleSubmitComment}>Submit Comment</Button>
          {currentMeme?.comments?.map((comment, index) => (
            <div key={index} className="single-view-comment">
              <p>
                <strong>{comment.user?.email}</strong>: {comment.content}
              </p>
            </div>
          ))}
        </div>{" "}
      </div>
      <SortingFilteringComponent
        onSortChange={handleSortChange}
        onFilterTypeChange={handleFilterTypeChange}
        onFilterTextChange={handleFilterValueChange}
        selectedSort={selectedSortCriteria}
        selectedFilterType={filterCriteria}
        filterText={filterValue}
      />
      {currentMeme && isVisible ? (
        <div className="single-view-card">
          <h2 className="single-view-title">{currentMeme?.name}</h2>
          <p className="single-view-description">{currentMeme?.description}</p>
          <div className="single-view-image">
            <img src={currentMeme?.content} alt={currentMeme?.name} />
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
              Like <span>({currentMeme?.upVotes.length})</span>
            </button>
            <button
              className="downvote-button"
              onClick={() => handleVoteClick(currentMeme?._id, "downVotes")}
            >
              Dislike <span>({currentMeme?.downVotes.length})</span>
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
            <Button
              className="singleView-share-button"
              onClick={() => setOpenStatistics(!openStatistics)}
            >
              Statistics
            </Button>
          <Snackbar
            open={openSnackbar}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
            message="Meme link copied to clipboard!"
          />
          </div>
        </div>
      ) : (
        <div className="single-view-card">
          <h2 className="single-view-title">
            Currently only "image" is supported
          </h2>
        </div>
      )
      }
    </div>
  );
};
export default SingleView;
