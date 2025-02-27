import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import SortingFilteringComponent from "../../components/Sorting-Filtering-Component/SortingFiltering";
import { setMemes, updateLikesDislikes } from "../../slices/memeSlice";
import { getAllMemes, handleUpVote, handleDownVote } from "../../api/meme";
import { Button } from "@mui/material"
import "./Home.css";

function Home() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.user.token);
  const navigate = useNavigate();
  const allMemes = useSelector((state) => state.meme.memes);
  const currentUser = useSelector((state) => state.user.currentUser);
  const memesLoaded = useSelector((state) => state.meme.memesLoaded);

  const [homeMemes, setHomeMemes] = useState([]);
  const [displayedMemes, setDisplayedMemes] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [sortOrder, setSortOrder] = useState(null);
  const [filterType, setFilterType] = useState("description");
  const [filterText, setFilterText] = useState("");
  //state to manage current page and meme limit
  const [page, setPage] = useState(1);
  const limit = 5;
  const currentUserID = currentUser?._id;

  useEffect(() => {
    if (token && !memesLoaded) {
      getAllMemes((memes) => {dispatch(setMemes({ memes: memes }))}, token);
    }
  }, [token, memesLoaded, dispatch]);

  useEffect(() => {
    const visibleMemes = allMemes.filter(meme => {
      // Check if the meme is public
      if (meme.privacy === "public") {
        return true;
      }
      // Check if the meme is unlisted and created by the current user
      // Adjust this condition based on how your data is structured
      const creatorId = meme.createdBy._id || meme.createdBy;
      return meme.privacy === "unlisted" && creatorId === currentUserID;
    });
    // first filter
    let filteredMemes = visibleMemes.filter((meme) => {
      switch (filterType) {
        case "description":
          return meme.description?.toLowerCase().includes(filterText.toLowerCase());
        case "title":
          return meme.name?.toLowerCase().includes(filterText.toLowerCase());
        case "likes":
          const exactLikes = parseInt(filterText, 10);

          return !isNaN(exactLikes) && meme.upVotes.length === exactLikes;
        case "dislikes":
          const exactDislikes = parseInt(filterText, 10);
          return (
            !isNaN(exactDislikes) && meme.downVotes.length === exactDislikes
          );
        case "fileFormat":
          return meme.format?.toLowerCase().includes(filterText.toLowerCase());
        default:
          return true; // No filtering applied
      }
    });

    // Then sort, only sort the memes if sortOrder is not null
    const sortedFilteredMemes = sortOrder
      ? [...filteredMemes].sort((a, b) => {
          switch (sortOrder) {
            case "mostLikes":
              return b.upVotes.length - a.upVotes.length;
            case "leastLikes":
              return a.upVotes.length - b.upVotes.length;
            case "newest":
              return new Date(b.createdAt) - new Date(a.createdAt);
            case "oldest":
              return new Date(a.createdAt) - new Date(b.createdAt);
            default:
              return filteredMemes;
          }
        })
      : filteredMemes;
    setDisplayedMemes(sortedFilteredMemes.slice(0, limit * page));
    setHomeMemes(sortedFilteredMemes);
  }, [dispatch, token, sortOrder, filterType, filterText, limit, allMemes, memesLoaded, page, currentUserID, displayedMemes.length]);



  const fetchMoreData = () => {
    if (page * limit < homeMemes.length) {
      setPage((prevPage) => prevPage + 1);
     
      // Now update the displayed memes with the sorted and filtered list
      setDisplayedMemes((prevMemes) => [
        ...prevMemes,
        ...homeMemes.slice(page * limit, (page + 1) * limit),
      ]);
    } else {
      setHasMore(false);
    }
  };

  /*const handleFilterTypeChange = (newFilterType) => {
    setFilterType(newFilterType);
  };
  */
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

  const navigateToSingleView = (memeId) => {
    navigate(`/meme/${memeId}`);
  };

  const handleShareClick = (memeId) => {
    const memeLink = `${window.location.origin}/meme/${memeId}`;
    navigator.clipboard.writeText(memeLink).then(
      () => {
        alert("Meme link copied to clipboard!");
      },
      (err) => {
        console.error("Could not copy meme link: ", err);
      }
    );
  };

  return (
    <div className="home">
      <h1>Memes</h1>
      <SortingFilteringComponent
        onSortChange={setSortOrder}
        onFilterTypeChange={setFilterType}
        onFilterTextChange={setFilterText}
      />
<InfiniteScroll
        dataLength={displayedMemes.length}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
      >
        <div className="meme-list">
          {displayedMemes.slice(0, page * limit).map((meme) => (
            <div key={meme._id} className="meme-card">
              <div className="meme-title">{meme.name || "Next Meme"}</div>
              <div className="meme-description">{meme.description}</div>
              <div
                className="meme-image"
                onClick={() => navigateToSingleView(meme._id)}
              >
                {meme.content ? (
                  <img
                    src={meme.content}
                    alt={`name: ${meme.name}, description: ${meme.description}`}
                    style={{ width: "100%", height: "auto" }}
                  />
                ) : (
                  <div className="empty-meme">No Image</div>
                )}
              </div>
              <div className="meme-actions">
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  style={{ minWidth: "90px", minHeight: '40px', marginRight: '8px' }}
                  onClick={() => handleVoteClick(meme._id, "upVotes")}
                >
                  Like ({meme.upVotes.length})
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  size="small"
                  style={{ minWidth: "90px", minHeight: '40px', marginRight: '8px' }}
                  onClick={() => handleVoteClick(meme._id, "downVotes")}
                >
                  Dislike ({meme.downVotes.length})
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  style={{ minWidth: "90px", minHeight: '40px' }}
                  onClick={() => handleShareClick(meme._id)}
                >
                  Share
                </Button>
                <div className="meme-comments-count">
                  Comments:{" "}
                  <span>{meme.comments ? meme.comments.length : 0}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
}

export default Home;
