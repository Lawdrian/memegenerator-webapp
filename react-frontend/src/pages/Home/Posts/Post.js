import React, { useState } from "react";
import "./Post.css"
import axios from "axios"; // Import axios for making API requests

function Post({ title, imageUrl, id }) {
  const [comments, setComments] = useState([]);
  const [currentComment, setCurrentComment] = useState("");

  // Function to add a comment
  const addComment = () => {
    if (currentComment !== "") {
      setComments([...comments, currentComment]);
      setCurrentComment(""); // Reset the comment input
    }
  };

  // Function to handle rating
  const rate = (rating) => {
    // Make an API call to rate the post
    const endpoint = rating === "thumbsUp" ? `/api/posts/${id}/like` : `/api/posts/${id}/dislike`;
    axios
      .post(endpoint)
      .then((response) => {
        // Handle the response, e.g., update UI or state
      })
      .catch((error) => console.error("Error rating post:", error));
  };

  return (
    <div className="post-container">
      <div className="post">
        <div className="post__image">
          <img src={imageUrl} alt="Post Image" />
        </div>
        <div className="post__footer">
          <div className="post__comments">
            <p>Comments so far</p>
            <div>
              <input
                type="text"
                placeholder="Add a comment..."
                value={currentComment}
                onChange={(e) => setCurrentComment(e.target.value)}
              />
              <button onClick={addComment}>Add</button>
            </div>
            {comments.map((comment, index) => (
              <div key={index}>{comment}</div>
            ))}
          </div>
        </div>
      </div>
      <div className="post__title">
        <h3>{title}</h3>
      </div>
      <div className="post__rating">
        <button onClick={() => rate("thumbsUp")}>&#128077;</button>
        <button onClick={() => rate("thumbsDown")}>&#128078;</button>
      </div>
    </div>
  );
}

export default Post;
