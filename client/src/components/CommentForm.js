import React, { useState, useEffect } from 'react';

const Comments = ({ articleId }) => {
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    // Fetch user data and set the user's name
    const fetchUserData = async () => {
      try {
        const authToken = localStorage.getItem('authToken');
        const response = await fetch('/login', {
          headers: {
            'Authorization': `Bearer ${authToken}`,
          },
        });
        const data = await response.json();
        setUserName(data.name);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

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
      <p>Logged in as: {userName}</p>
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
