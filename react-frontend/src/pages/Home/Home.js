import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import SortingFilteringComponent from "../../components/Sorting-Filtering-Component/SortingFiltering";
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
  const [sortOrder, setSortOrder] = useState(null);
  const [filterType, setFilterType] = useState('description');
  const [filterText, setFilterText] = useState('');
  //state to manage current page and meme limit
  const [page, setPage] = useState(1);
  const limit = 40;

  useEffect(() => {
    const handleFetchedMemes = (fetchedMemes) => {
      // first filter
      let filteredMemes = fetchedMemes.filter(meme => {
        switch (filterType) {
          case 'description':
            return meme.description.toLowerCase().includes(filterText.toLowerCase());
          case 'title':
            return meme.name.toLowerCase().includes(filterText.toLowerCase());
          case 'likes':
            const exactLikes = parseInt(filterText, 10);
            // Ensure exactLikes is a number and not NaN; if NaN, filter none
            return !isNaN(exactLikes) && meme.upVotes.length === exactLikes;
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

      dispatch(setMemes({ memes: sortedFilteredMemes }));
      setDisplayedMemes(sortedFilteredMemes.slice(0, limit));
    };

    getAllMemes(handleFetchedMemes, token);
  }, [dispatch, token, sortOrder, filterType, filterText, limit]);

  const fetchMoreData = () => {
    if (page * limit < allMemes.length) {
      setPage(prevPage => prevPage + 1);
      // Instead of sorting allMemes directly, first apply the filter, then sort
      let filteredMemes = allMemes.filter(meme => {
        switch (filterType) {
          case 'description':
            return meme.description.toLowerCase().includes(filterText.toLowerCase());
          case 'title':
            return meme.name.toLowerCase().includes(filterText.toLowerCase());
          case 'likes':
            const exactLikes = parseInt(filterText, 10);
            // Ensure exactLikes is a number and not NaN; if NaN, filter none
            return !isNaN(exactLikes) && meme.upVotes.length === exactLikes;
          default:
            return true; // No filtering applied
        }
      });
  
      // Then, sort the filtered memes according to the sortOrder
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
                return 0; // No sorting applied, just return filtered memes
            }
          })
        : filteredMemes; // If no sortOrder is specified, just use the filtered list
  
      // Now update the displayed memes with the sorted and filtered list
      setDisplayedMemes(prevMemes => [...prevMemes, ...sortedFilteredMemes.slice(page * limit, (page + 1) * limit)]);
    } else {
      setHasMore(false);
    }
  };

  const handleFilterTypeChange = (newFilterType) => {
    setFilterType(newFilterType)
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
      <SortingFilteringComponent onSortChange={setSortOrder} onFilterTypeChange={setFilterType}
        onFilterTextChange={setFilterText} />
      <InfiniteScroll
        dataLength={displayedMemes.length}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
      >
        <div className="meme-list">
          {allMemes.slice(0, page * limit).map((meme) => (
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
