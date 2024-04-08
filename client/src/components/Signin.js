import React, { useState } from 'react';
import axios from 'axios';
import { Link, useHistory } from 'react-router-dom';

function Signin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthor, setIsAuthor] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const history = useHistory();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = {
      email,
      password,
    };

    try {
      const response = await axios.post(isAuthor ? '/author-login' : '/login', formData);
      console.log('Login response:', response.data);
      
      // Store access token in localStorage
      localStorage.setItem('token', response.data.access_token);

      // Display success message
      setSuccessMessage('Login successful!');

      // Redirect to the article form if the user is an author
      if (isAuthor) {
        history.push('/article-form');
      } else {
        // Redirect to dashboard after successful login if not an author
        history.push('/dashboard');
      }
    } catch (error) {
      console.error('Login failed:', error.response.data);
      setError('Login failed. Please try again.');
    }
  };

  return (
    <div>
      <h2>Sign In</h2>
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              checked={isAuthor}
              onChange={() => setIsAuthor(!isAuthor)}
            />
            Sign in as an author
          </label>
        </div>
        <button type="submit">Sign In</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <p>Not registered? <Link to="/register">Register here</Link></p>
    </div>
  );
}

export default Signin;
