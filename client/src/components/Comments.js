
import React, { useState } from 'react';

const Comments = ({ articleId }) => {
  const [text, setText] = useState(''); // Rename 'content' state to 'text'
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        throw new Error('User not authenticated');
      }

      const response = await fetch(`/articles/${articleId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({ text }), // Send 'text' key in the request payload
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
