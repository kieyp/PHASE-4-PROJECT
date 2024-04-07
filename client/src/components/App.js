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
              <Comments user={user} /> {/* Pass user as a prop to Comments */}
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
      </div>
    </Router>
  );
}

export default App;
