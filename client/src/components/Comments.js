import React, { useState } from 'react';
import axios from 'axios';

function Comments({ articleId }) {
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false); 
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true); 

    try {
      const response = await axios.post(`/articles/${articleId}/comments`, { content });

      if (response.status === 201) {
        console.log('Comment submitted successfully');
        setContent('');
      } else {
        setError('Failed to submit comment');
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
      setError(error.message || 'Failed to submit comment. Please try again later.');
    } finally {
      setSubmitting(false); 
    }
  };

  return (
    <div>
      <h3>Add Comment</h3>
      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your comment here"
          disabled={submitting}
          required
        ></textarea>
        <button type="submit" disabled={submitting}>Submit Comment</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  );
}

export default Comments;
