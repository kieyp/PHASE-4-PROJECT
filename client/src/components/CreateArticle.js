import React, { useState } from 'react';
import axios from 'axios';

function CreateArticle() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      console.log('Submitting new article:', { title, content });
      const response = await axios.post('/articles', { title, content });
      console.log('Article creation response:', response.data); // Handle successful article creation response
      setMessage('Article created successfully!');
    } catch (error) {
      console.error('Error:', error.response.data); // Handle error response
      setMessage('Article creation failed. Please try again.');
    }
  };

  return (
    <div>
      <h2>Create New Article</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="content">Content:</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>
        <button type="submit">Create Article</button>
      </form>
    </div>
  );
}

export default CreateArticle;
