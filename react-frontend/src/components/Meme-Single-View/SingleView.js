import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getSingleMeme } from '../../api/meme';
import './SingleView.css';

const SingleView = () => {
    const { id } = useParams();
    const [meme, setMeme] = useState(null);
    const token = useSelector((state) => state.user.token); // Assuming you have the user slice in Redux

    useEffect(() => {
        if (token) {
            getSingleMeme(id, (data) => setMeme(data), token);
        }
    }, [id, token]);

    if (!meme) {
        return <div>Loading...</div>;
    }

    return (
        <div className="single-view">
            <div className="single-view-card">
                <div className="single-view-image">
                    <img src={meme.content} alt={meme.name} style={{ maxWidth: '100%', maxHeight: '100%' }} />
                </div>
                <div className="single-view-actions">
                    {/* Additional details and functionalities for SingleView */}
                </div>
            </div>
        </div>
    );
};

export default SingleView;
