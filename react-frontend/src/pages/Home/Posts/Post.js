import React, { useState } from "react";
import "./Post.css";

function Post({ title, imageUrl }) {
  //const [thumbsUp, setThumbsUp] = useState(0);
  //const [thumbsDown, setThumbsDown] = useState(0);
  const [comments, setComments] = useState([]);
  //const [userRating, setUserRating] = useState(null); // Zustand für die Bewertung des Benutzers
  const [currentComment, setCurrentComment] = useState(""); // Zustand für den aktuellen Kommentar

  // function for rating
  /* const rate = (rating) => {
    if (userRating === null || userRating === rating) {
      const newRating = userRating === null ? rating : null;
      setUserRating(newRating);

      // API-call
      const endpoint = newRating === "thumbsUp" ? `/api/posts/${id}/like` : `/api/posts/${id}/dislike`;
      axios.post(endpoint)
        .then(response => {
          if (newRating === "thumbsUp") {
            setThumbsUp(thumbsUp + 1);
          } else if (newRating === "thumbsDown") {
            setThumbsDown(thumbsDown + 1);
          }
        })
        .catch(error => console.error('Fehler:', error));
    }
  }; */

  // Funktion zum Hinzufügen eines Kommentars
  const addComment = () => {
    if (currentComment !== "") {
      setComments([...comments, currentComment]);
      setCurrentComment(""); // Kommentar zurücksetzen
    }
  };

  /*
  <div className="post__rating">
            <button onClick={() => rate("thumbsUp")}>&#128077;</button>
            <span>{thumbsUp}</span>
            <button onClick={() => rate("thumbsDown")}>&#128078;</button>
            <span>{thumbsDown}</span>
          </div>
  */

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
    </div>
  );
}

export default Post;
