import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';

const Signin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const history = useHistory(); // useHistory hook to access history object

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('/login', { email, password });
      const { access_token } = response.data; // Extract access token from response

      // Store access token in local storage
      localStorage.setItem('accessToken', access_token);

      // Redirect to the dashboard route after successful login
      history.push('/dashboard');
    } catch (error) {
      console.error('Error:', error.response.data); // Log the error response for debugging
      setError('Invalid email or password');
    }
  };

  return (
    <div>
      <h2>Sign In</h2>
      {error && <p>{error}</p>}
      <form onSubmit={handleLogin}>
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
        <button type="submit">Sign In</button>
      </form>
      <p>Don't have an account? <Link to="/register">Register</Link></p>
    </div>
  );
}

export default Signin;