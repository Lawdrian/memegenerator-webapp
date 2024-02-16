import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import { setMemes, updateLikesDislikes } from "../../slices/memeSlice";
import { getAllMemes, handleUpVote, handleDownVote } from "../../api/meme";
import "./Home.css";

function Home() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.user.token);
  const navigate = useNavigate();
  const allMemes = useSelector((state) => state.meme.memes);

  const [displayedMemes, setDisplayedMemes] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  //state to manage current page and meme limit
  const [page, setPage] = useState(1);
  const limit = 40;

  useEffect(() => {
    const handleFetchedMemes = (fetchedMemes) => {
      dispatch(setMemes({ memes: fetchedMemes }));
      setDisplayedMemes(fetchedMemes.slice(0, limit));
    };

    getAllMemes(handleFetchedMemes, token);
  }, [dispatch, token]);

   

  const fetchMoreData = () => {
    if (page * limit < allMemes.length) {
      setPage(page + 1);
      setDisplayedMemes(allMemes.slice(0, (page + 1) * limit));
    } else {
      setHasMore(false);
    }
  };

  const handleVoteClick = async (memeId, voteType) => {
    const updateFunction = voteType === "upVotes" ? handleUpVote : handleDownVote;
    try {
      const updatedMeme = await updateFunction(memeId, token);
    
      dispatch(updateLikesDislikes({
        memeId: updatedMeme._id,
        upVotes: updatedMeme.upVotes,
        downVotes: updatedMeme.downVotes,
      }));
    } catch (error) {
      console.error("Error updating vote:", error);
    }
  };

  const navigateToSingleView = (memeId) => {
    navigate(`/meme/${memeId}`);
  };
  

  

  const handleShareClick = (memeId) => {
    const memeLink = `/meme/${memeId}`;
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
      <InfiniteScroll
        dataLength={displayedMemes.length}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
      >
        <div className="meme-list">
          {
            allMemes.slice(0, page * limit).map((meme) => (
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
                      alt={`Meme ${meme._id}`}
                      style={{ width: "100%", height: "auto" }}
                    />
                  ) : (
                    <div className="empty-meme">No Image</div>
                  )}
                </div>
                <div className="meme-actions">
                  <button
                    className="upvote-button"
                    onClick={() => handleVoteClick(meme._id, "upVotes")}
                  >
                    Like <span>({meme.upVotes.length})</span>
                  </button>
                  <button
                    className="downvote-button"
                    onClick={() => handleVoteClick(meme._id, "downVotes")}
                  >
                    Dislike <span>({meme.downVotes.length})</span>
                  </button>
                  <button
                    className="share-button"
                    onClick={() => handleShareClick(meme._id)}
                  >
                    Share
                  </button>
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

