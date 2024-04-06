import { Switch, Route } from "react-router-dom";
import Header from "./Header";
import Home from "./Home";
import BlogArticle from "./BlogArticle"; 
import ArticleList from "./ArticleList";
import Signin from "./Signin";
import Register from "./Register";
import Profile from "./Profile";
import Authors from "./Authors";
import Comments from "./Comments";



function App() {
  return (
    <div>
      <Header />
      <main>
        <Switch>
          <Route exact path="/blogarticle">
          <BlogArticle />
        </Route>

        <Route exact path="/artticlelist">
          <ArticleList />
        </Route>


        <Route exact path="/signin">
          <Signin />
        </Route>

        <Route exact path="/register">
          <Register />
        </Route>

        <Route exact path="/profile">
          <Profile />
        </Route>
        <Route exact path="/authors">
          <Authors />
        </Route>
  

          <Route exact path="/">
            <Home />
          </Route>
        </Switch>
      </main>
    </div>
  );
}

export default App;
