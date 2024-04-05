import React, { useState } from 'react';

const CommentForm = ({ onSubmit }) => {
  const [comment, setComment] = useState('');

  const handleChange = (e) => {
    setComment(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(comment);
    setComment('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea value={comment} onChange={handleChange} placeholder="Write your comment..." required />
      <button type="submit">Submit</button>
    </form>
  );
};

export default CommentForm;
