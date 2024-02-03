import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getSingleMeme } from '../../api/meme';

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
        <div>
            <img src={meme.content} alt={meme.name} />
            {/* Weitere Details und Funktionalitäten für die SingleView */}
        </div>
    );
};

export default SingleView;
