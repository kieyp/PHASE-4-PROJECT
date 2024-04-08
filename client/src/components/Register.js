import React, { useState } from 'react';
import axios from 'axios';
import { Link, useHistory } from 'react-router-dom';

function Register() {
  const [fullname, setFullname] = useState('');
  const [contact, setContact] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [isAuthor, setIsAuthor] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const history = useHistory();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!fullname || !contact || !email || !password) {
      setError('Please fill out all required fields');
      return;
    }

    const formData = {
      fullname,
      contact,
      email,
      password,
      bio: isAuthor ? bio : '', // Only include bio if registering as an Author
      location: isAuthor ? location : '', // Only include location if registering as an Author
    };

    try {
      const response = await axios.post(isAuthor ? '/author/register' : '/register', formData);
      console.log('Registration response:', response.data);
      setSuccessMessage('Registration successful! You can now log in.');
      // Do not change the history.push('/signin') line
      history.push('/signin');
    } catch (error) {
      console.error('Registration failed:', error.response ? error.response.data : error.message);
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <div>
      <h2>Register</h2>
      {successMessage && (
        <div className="success-message">
          <p style={{ color: 'green' }}>{successMessage}</p>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="fullname">Full Name:</label>
          <input
            type="text"
            id="fullname"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="contact">Contact:</label>
          <input
            type="text"
            id="contact"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            required
          />
        </div>
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
            Register as an author
          </label>
        </div>
        {isAuthor && (
          <>
            <div>
              <label htmlFor="bio">Bio:</label>
              <textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="location">Location:</label>
              <input
                type="text"
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            </div>
          </>
        )}
        <button type="submit">Register</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
      <p>Already have an account? <Link to="/signin">Sign in here</Link></p>
    </div>
  );
}

export default Register;
