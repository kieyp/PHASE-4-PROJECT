import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ArticleForm = () => {
  const [authorDetails, setAuthorDetails] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    body: ''
  });

  useEffect(() => {
    const fetchAuthorDetails = async () => {
      try {
        const token = localStorage.getItem('token'); // Retrieve the access token from localStorage
        const response = await axios.get('/author-details', {
          headers: {
            Authorization: `Bearer ${token}` // Include the access token in the request headers
          }
        });
        setAuthorDetails(response.data);
      } catch (error) {
        console.error('Error fetching author details:', error);
      }
    };

    fetchAuthorDetails();
  }, []); // This effect runs only once when the component mounts

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token'); // Retrieve the access token from localStorage
      const response = await axios.post('/articles', formData, {
        headers: {
          Authorization: `Bearer ${token}` // Include the access token in the request headers
        }
      });
      console.log(response.data);
    } catch (error) {
      console.error('Article creation failed:', error.response.data);
    }
  };

  return (
    <div>
      <h2>Write Article</h2>
      {authorDetails && (
        <div>
          <p>Username: {authorDetails.username}</p>
          <p>Location: {authorDetails.location}</p>
          <p>Full Name: {authorDetails.fullName}</p>
          <p>Bio: {authorDetails.bio}</p>
        </div>
      )}
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
    </div>
  );
};

export default ArticleForm;
