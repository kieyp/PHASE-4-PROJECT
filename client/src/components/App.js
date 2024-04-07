import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Header from "./Header";
import Home from "./Home";
import Signin from "./Signin";
import Register from "./Register";
import ArticleList from "./ArticleList";
import BlogArticle from "./BlogArticle";
import Profile from "./Profile";
import Authors from "./Authors";
import Comments from "./Comments";
import Dashboard from "./Dashboard"; // Import the Dashboard component

function App() {
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
              <Signin />
            </Route>
            <Route path="/register">
              <Register />
            </Route>
            <Route path="/articles">
              <ArticleList />
            </Route>
            <Route path="/article/:id">
              <BlogArticle />
              <Comments />
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
            <Route path="/dashboard"> {/* Route for the dashboard */}
              <Dashboard />
            </Route>
          </Switch>
        </main>
      </div>
    </Router>
  );
}

export default App;
