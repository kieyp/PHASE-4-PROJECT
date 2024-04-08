import React, { useState } from 'react';
import { useUser } from './UserProvider'; // Import the useUser hook

const Comments = ({ articleId }) => {
  const { userData } = useUser(); // Use the useUser hook to get user data
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const fullName = userData ? userData.name : ''; // Get the user's full name from userData

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const authToken = localStorage.getItem('authToken');
      console.log('authToken:', authToken); // Log authToken to check if it's undefined
      if (!authToken) {
        throw new Error('No auth token found');
      }

      const response = await fetch(`/articles/${articleId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`, // Include the auth token in the Authorization header
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit comment');
      }

      console.log('Comment submitted successfully');
      setText('');
    } catch (error) {
      console.error('Error submitting comment:', error);
      setError(error.message || 'Failed to submit comment');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h3>Add Comment</h3>
      <p>Logged in as: {fullName}</p>
      <form onSubmit={handleSubmit}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write your comment here"
          disabled={submitting}
        ></textarea>
        <button type="submit" disabled={submitting}>
          {submitting ? 'Submitting...' : 'Submit Comment'}
        </button>
        {error && <p>{error}</p>}
      </form>
    </div>
  );
};

export default Comments;