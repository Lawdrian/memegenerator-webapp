import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getSingleMeme } from '../../api/meme';
import './SingleView.css';

const SingleView = () => {
    const { id } = useParams();
    const allMemes = useSelector((state) => state.meme.memes);
    const token = useSelector((state) => state.user.token);

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
                    <button onClick={() => handleArrowClick('left')}>previous</button>
                    <button onClick={handleRandomClick}>Random</button>
                    <button onClick={handleAutoPlayClick}>
                        {isAutoPlayActive ? 'Stop' : 'Auto Play'}
                    </button>
                    <button onClick={() => handleArrowClick('right')}>next</button>
                    {/* Additional details and functionalities for SingleView */}
                </div>
            </div>
        </div>
    );
};

export default SingleView;
