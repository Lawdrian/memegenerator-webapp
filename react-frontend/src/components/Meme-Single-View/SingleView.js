import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getSingleMeme, voteMeme } from '../../api/meme';
import { updateLikesDislikes } from '../../slices/memeSlice';
import './SingleView.css';

const SingleView = () => {
    const { id } = useParams();
    const allMemes = useSelector((state) => state.meme.memes);
    const token = useSelector((state) => state.user.token);
    const dispatch = useDispatch();

    const [currentMemeIndex, setCurrentMemeIndex] = useState(0);
    const [autoPlayInterval, setAutoPlayInterval] = useState(null);
    const [isAutoPlayActive, setIsAutoPlayActive] = useState(false);

    useEffect(() => {
        if (token) {
            // Fetch a list of memes or load it from some source
            // In this example, I'm using the list of memes from the Redux store
        }
    }, [id, token]);

    const handleArrowClick = (direction) => {
        if (direction === 'left') {
            setCurrentMemeIndex((prevIndex) => (prevIndex === 0 ? allMemes.length - 1 : prevIndex - 1));
        } else if (direction === 'right') {
            setCurrentMemeIndex((prevIndex) => (prevIndex === allMemes.length - 1 ? 0 : prevIndex + 1));
        }
    };

    const handleVoteClick = (voteType) => {
        voteMeme(id, voteType, token)
            .then((updatedMeme) => {
                console.log('Meme updated with votes:', updatedMeme);

                // Dispatch the updateLikesDislikes action to update Redux state
                dispatch(updateLikesDislikes({
                    memeId: id,
                    upVotes: updatedMeme.upVotes,
                    downVotes: updatedMeme.downVotes,
                }));
            })
            .catch((error) => {
                console.error('Error voting for meme:', error);
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
                        <img src={currentMeme.content} alt={currentMeme.name} style={{ maxWidth: '100%', maxHeight: '100%' }} />
                    ) : (
                        <div className="empty-meme">No Image</div>
                    )}
                </div>
                <div className="single-view-actions">
                    <button className="previous-button" onClick={() => handleArrowClick('left')}>previous</button>
                    <button className="random-button" onClick={handleRandomClick}>Random</button>
                    <button onClick={handleAutoPlayClick}>
                        {isAutoPlayActive ? 'Stop' : 'Auto Play'}
                    </button>
                    <button className="next-button" onClick={() => handleArrowClick('right')}>next</button>
                    <button className="upvote-button" onClick={() => handleVoteClick('upVotes')}>
                        Like <span>({currentMeme.upVotes.length})</span>
                    </button>
                    <button className="downvote-button" onClick={() => handleVoteClick('downVotes')}>
                        Dislike <span>({currentMeme.downVotes.length})</span>
                    </button>
                    
                    {/* Additional details and functionalities for SingleView */}
                </div>
            </div>
        </div>
    );
};

export default SingleView;
