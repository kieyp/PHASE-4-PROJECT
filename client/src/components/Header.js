import { Link } from "react-router-dom";

function Header() {
  return (
    <header>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/blogarticle">Blog Article</Link>
          </li>
          <li>
            <Link to="/artticlelist">Article list</Link>
          </li>

          <li>
            <Link to="/signin">Sign In</Link>
          </li>

          <li>
            <Link to="/profile">Profile</Link>
          </li>
          <li>
            <Link to="/authors">Authors</Link>
          </li>
       
        </ul>
      </nav>
    </header>
  );
}

export default Header;
