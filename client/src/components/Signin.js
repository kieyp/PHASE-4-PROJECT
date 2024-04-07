import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';
import Dashboard from './Dashboard'; // Import the Dashboard component

function Signin({ setLoggedInUserId }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false); // State to show the dashboard after successful login
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
      console.log('Response:', response); // Log the response data

      if (response.status === 200) {
        // Assuming the response.data contains the user ID
        setLoggedInUserId(response.data.userId);
        setShowDashboard(true); // Show the dashboard after successful login
      } else {
        setErrorMessage('Invalid credentials'); // Handle other status codes appropriately
      }
    } catch (error) {
      console.error('Error:', error); // Log error to console
      setErrorMessage('Login failed. Please try again.'); // Generic error message for any error
    } finally {
      setIsLoading(false);
    }
  };

  // Render the Signin form or Dashboard based on showDashboard state
  return (
    <div>
      {showDashboard ? (
        <Dashboard />
      ) : (
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
      )}
    </div>
  );
}

export default Signin;
