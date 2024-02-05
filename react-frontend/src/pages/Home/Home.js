import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import { setMemes, updateLikesDislikes } from "../../slices/memeSlice";
import { getAllMemes, voteMeme } from "../../api/meme";
import "./Home.css";

function Home() {
  const dispatch = useDispatch();
  const allMemes = useSelector((state) => state.meme.memes);
  const token = useSelector((state) => state.user.token);
  const navigate = useNavigate();

  const [displayCount, setDisplayCount] = useState(40);
  const [hasMore, setHasMore] = useState(true);
  const memesPerLoad = 40;

  useEffect(() => {
    // Initially load memes from the backend if needed
    if(allMemes.length === 0) {
      getAllMemes(token).then((memes) => {
        dispatch(setMemes({ memes }));
      });
    }
  }, [dispatch, token, allMemes.length]);

  const fetchMoreData = () => {
    if (displayCount >= allMemes.length) {
      setHasMore(false);
    } else {
      setDisplayCount(displayCount + memesPerLoad);
    }
  };

  // This computes the memes to be displayed based on displayCount
  const displayedMemes = allMemes.slice(0, displayCount);
  
  const handleShareClick = (memeId) => {
    const memeLink = `${window.location.origin}/api/memes/${memeId}`;
    navigator.clipboard.writeText(memeLink).then(
      () => {
        alert("Meme link copied to clipboard!");
      },
      (err) => {
        console.error("Could not copy meme link: ", err);
      }
    );
  };

  const navigateToSingleView = (memeId) => {
    navigate(`/api/memes/${memeId}`);
  };

  const handleVoteClick = (memeId, voteType) => {
    voteMeme(memeId, voteType, token)
      .then((updatedMeme) => {
        dispatch(
          updateLikesDislikes({
            memeId: memeId,
            upVotes: updatedMeme.upVotes,
            downVotes: updatedMeme.downVotes,
          })
        );
      })
      .catch((error) => {
        console.error("Error voting for meme:", error);
      });
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
          {displayedMemes.map((meme) => (
            <div key={meme._id || meme.name} className="meme-card">
              <div className="meme-title">{meme.name || "Next Meme"}</div>
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
