import React, { useState } from 'react';
import axios from 'axios';

const AuthorRegister = () => {
  const [formData, setFormData] = useState({
    username: '',
    fullname: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/register', formData);
      console.log(response.data);
      // Optionally, you can redirect the user to the login page or show a success message
    } catch (error) {
      console.error('Registration failed:', error.response.data);
      // Handle registration failure, show error message, etc.
    }
  };

  return (
    <div>
      <h2>Author Registration</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input type="text" name="username" value={formData.username} onChange={handleChange} required />
        </div>
        <div>
          <label>Full Name:</label>
          <input type="text" name="fullname" value={formData.fullname} onChange={handleChange} required />
        </div>
        <div>
          <label>Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} required />
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default AuthorRegister;