import React, { useState } from "react";
import { withRouter } from "react-router-dom";

import ChatHttpServer from "../../../services/ChatHttpServer";
import "./Login.css";

const Login = props => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async event => {
    event.preventDefault();
    props.setLoadingState(true);
    try {
      const response = await ChatHttpServer.login({
        username: username,
        password: password
      });
      props.setLoadingState(false);
      setError("");
      ChatHttpServer.setLS("userid", response.userId);
      props.history.push(`/chat`);
    } catch (error) {
      props.setLoadingState(false);
      setError(error.response.data.message);
    }
  };

  return (
    <div className="container">
      <div className="background-wrap">
        <div className="background"></div>
      </div>
      <form id="accesspanel">
        <h1 id="litheader">Login</h1>
        <div className="inset">
          <p>
            <input
              type="text"
              id="email"
              placeholder="Enter username"
              value={username}
              onChange={e => {
                setUsername(e.target.value);
              }}
            />
          </p>
          <p>
            <input
              id="password"
              placeholder="Password"
              type="password"
              value={password}
              onChange={e => {
                setPassword(e.target.value);
              }}
            />
          </p>
        </div>
        {error.trim() !== "" ? <p className="p-container">{error}</p> : null}
        <p className="p-container">
          <button id="go" name="Login" onClick={handleLogin}>
            Login
          </button>
        </p>
      </form>
    </div>
  );
};

export default withRouter(Login);
