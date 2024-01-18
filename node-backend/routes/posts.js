const express = require('express');
const router = express.Router();
//const Post = require('../models/Post'); hier wird die Datenbank dann eingebunden

router.get('/posts', async (req, res) => {
    try {
        const posts = await Post.find();
        res.json(posts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// give thumbs up
router.post('/posts/:id/like', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        // Fügen Sie Logik hinzu, um die Benutzer-ID zu den likes hinzuzufügen
        // Speichern Sie das aktualisierte Post-Objekt
        res.json(updatedPost);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// give thumbs down
router.post('/posts/:id/dislike', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        // Fügen Sie Logik hinzu, um die Benutzer-ID zu den dislikes hinzuzufügen
        // Speichern Sie das aktualisierte Post-Objekt
        res.json(updatedPost);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;