const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: String,
    imageUrl: String,
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    // ..
});

module.exports = mongoose.model('Post', postSchema);