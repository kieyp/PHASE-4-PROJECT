import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

const Comments = ({ articleId, loggedInUserId }) => {
  const [content, setContent] = useState('');
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!loggedInUserId) {
      alert('Please sign in to comment');
      history.push('/signin');
      return;
    }

    try {
      const response = await fetch(`/articles/${articleId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content, userId: loggedInUserId }),
      });

      if (response.ok) {
        console.log('Comment submitted successfully');
        setContent(''); // Clear the comment textarea after successful submission
        // Optionally, redirect to another page after comment submission
        history.push('/articles');
      } else {
        console.error('Failed to submit comment');
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  return (
    <div>
      <h3>Add Comment</h3>
      <form onSubmit={handleSubmit}>
        <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Write your comment here"></textarea>
        <button type="submit">Submit Comment</button>
      </form>
    </div>
  );
};

export default Comments;
