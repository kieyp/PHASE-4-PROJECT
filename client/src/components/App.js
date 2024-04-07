import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import Header from './Header';
import Home from './Home';
import Signin from './Signin';
import Register from './Register';
import ArticleList from './ArticleList';
import BlogArticle from './BlogArticle';
import Profile from './Profile';
import Authors from './Authors';
import Dashboard from './Dashboard';
import Comments from './Comments';

function App() {
  const [loggedInUserId, setLoggedInUserId] = useState(null);

  return (
    <Router>
      <div>
        <Header />
        <main>
          <Switch>
            <Route exact path="/">
              <Home />
            </Route>
            <Route path="/signin">
              {loggedInUserId ? (
                <Redirect to="/dashboard" />
              ) : (
                <Signin setLoggedInUserId={setLoggedInUserId} />
              )}
            </Route>
            <Route path="/register">
              <Register />
            </Route>
            <Route path="/dashboard">
              {loggedInUserId ? <Dashboard /> : <Redirect to="/signin" />}
            </Route>
            <Route path="/articles">
              {loggedInUserId ? <ArticleList /> : <Redirect to="/signin" />}
            </Route>
            <Route path="/article/:id">
              <BlogArticle loggedInUserId={loggedInUserId} />
              {loggedInUserId && <Comments loggedInUserId={loggedInUserId} />}
            </Route>
            <Route path="/profile">
              <Profile />
            </Route>
            <Route path="/authors">
              <Authors />
            </Route>
          </Switch>
        </main>
      </div>
    </Router>
  );
}

export default App;
