import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./components/App";
import { BrowserRouter } from "react-router-dom";
import { UserProvider } from "./components/UserProvider"; // Import the UserProvider component

ReactDOM.render(
  <BrowserRouter>
    <UserProvider> {/* Wrap your App component with UserProvider */}
      <App />
    </UserProvider>
  </BrowserRouter>,
  document.getElementById("root")
);
