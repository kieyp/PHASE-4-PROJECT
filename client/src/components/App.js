<<<<<<< HEAD

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
=======
import React, { useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Header from "./Header";
import Home from "./Home";
import Signin from "./Signin";
import Register from "./Register";
import ArticleList from "./ArticleList";
import BlogArticle from "./BlogArticle";
import Profile from "./Profile";
import Authors from "./Authors";
import Comments from "./CommentForm";
import Dashboard from "./Dashboard";

function App() {
  const [user, setUser] = useState(null); // Initialize user state to null

  return (
    <Router>
      <div>
        <Header user={user} /> {/* Pass user as a prop to Header */}
        <main>
          <Switch>
            <Route exact path="/">
              <Home />
            </Route>
            <Route path="/signin">
              <Signin setUser={setUser} /> {/* Pass setUser as a prop to Signin */}
            </Route>
            <Route path="/register">
              <Register />
            </Route>
            <Route path="/articles">
              <ArticleList />
            </Route>
            <Route path="/article/:id">
              <BlogArticle />
              {user && <Comments user={user} />} {/* Render Comments only if user is signed in */}
            </Route>
            <Route path="/blogarticle">
              <BlogArticle />
            </Route>
            <Route path="/profile">
              <Profile />
            </Route>
            <Route path="/authors">
              <Authors />
            </Route>
            <Route path="/dashboard">
              <Dashboard />
            </Route>
          </Switch>
        </main>
>>>>>>> refs/remotes/git@github.com-kieyp/PHASE-4-PROJECT.git/development
      </div>
    </Router>
  );
};

export default App;