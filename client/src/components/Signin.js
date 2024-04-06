import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';

function Signin({ setLoggedInUserId }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      if (!email || !password) {
        setErrorMessage('Email and password are required');
        setIsLoading(false);
        return;
      }

      const response = await axios.post('/login', { email, password });

      if (response.status === 200) {
        setErrorMessage('');
        setIsLoading(false);
        setLoggedInUserId(response.data.userId); // Assuming the server returns the logged-in user's ID
        history.push('/articles'); // Redirect to the ArticleList component
      } else {
        setErrorMessage('An unexpected error occurred');
        setIsLoading(false);
      }
    } catch (error) {
      if (error.response) {
        setErrorMessage(error.response.data.message || 'Login failed. Please try again.');
      } else {
        setErrorMessage('Network error. Please try again later.');
      }
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2>Sign In</h2>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={handleEmailChange}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={handlePasswordChange}
            required
          />
        </div>
        <button type="submit" disabled={isLoading}>{isLoading ? 'Signing in...' : 'Sign In'}</button>
      </form>
      <p>Not registered? <Link to="/register">Register Here</Link></p>
    </div>
  );
}

export default Signin;
