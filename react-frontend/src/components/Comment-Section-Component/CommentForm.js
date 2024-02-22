import React, { useState } from 'react';


const CommentForm = ({ meme, token }) => {
  const [commentContent, setCommentContent] = useState('');

  const onSubmit = (e) => {
    e.preventDefault();
    handleCommentSubmit(meme, commentContent, token)
      .then(response => {
        // Optionally reset commentContent state or update UI to show the new comment
        setCommentContent('');
      })
      .catch(error => {
        console.error('Error adding comment:', error);
      });
  };

  return (
    <form onSubmit={onSubmit}>
      <textarea
        value={commentContent}
        onChange={(e) => setCommentContent(e.target.value)}
        placeholder="Write a comment..."
        required
      />
      <button type="submit">Submit Comment</button>
    </form>
  );
};

export default CommentForm;

