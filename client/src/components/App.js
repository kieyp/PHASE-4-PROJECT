
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import BlogPost from './components/BlogPost';
import AdminDashboard from './components/AdminDashboard';
import NotFound from './components/NotFound';
import Navbar from './components/Navbar';
import './App.css';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    fetch('/api/auth/checkLoggedIn')
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setIsLoggedIn(true);
          setUser(data.user);
        }
      })
      .catch(error => {
        console.error('Error checking login status:', error);
      });
  }, []);

  const handleLogout = () => {
    fetch('/api/auth/logout', {
      method: 'POST'
    })
      .then(() => {
        setIsLoggedIn(false);
        setUser(null);
      })
      .catch(error => {
        console.error('Error logging out:', error);
      });
  };

  return (
    <Router>
      <div className="App">
        <Navbar isLoggedIn={isLoggedIn} user={user} handleLogout={handleLogout} />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/login" render={(props) => <Login {...props} setIsLoggedIn={setIsLoggedIn} setUser={setUser} />} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/post/:postId" component={BlogPost} />
          {isLoggedIn && user.isAdmin && <Route exact path="/admin" component={AdminDashboard} />}
          <Route component={NotFound} />
        </Switch>
      </div>
    </Router>
  );
};

export default App;