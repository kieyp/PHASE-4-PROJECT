import React, { useState } from 'react';
import axios from 'axios';
import { Link, useHistory } from 'react-router-dom';

const ArticleForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    body: ''
  });
  const history = useHistory();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/articles', formData);
      console.log(response.data);
      // Optionally, you can redirect the user or show a success message

      // If the user is not logged in, redirect to the sign-in page
      if (!localStorage.getItem('accessToken')) {
        history.push('/signin');
      }
    } catch (error) {
      console.error('Article creation failed:', error.response.data);
      // Handle article creation failure, show error message, etc.
    }
  };

  return (
    <div>
      <h2>Write Article</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} required />
        </div>
        <div>
          <label>Body:</label>
          <textarea name="body" value={formData.body} onChange={handleChange} required />
        </div>
        <button type="submit">Submit</button>
      </form>
      <p>Already have an account? <Link to="/signin">Sign In</Link></p>
      <p>Don't have an account? <Link to="/register">Register</Link></p>
    </div>
  );
};

export default ArticleForm;
