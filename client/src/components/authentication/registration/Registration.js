import React, { useState } from "react";
import { withRouter } from "react-router-dom";

import ChatHttpServer from "../../../services/ChatHttpServer";
import "./Registration.css";

const Registration = props => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegistration = async event => {
    event.preventDefault();
    props.loadingState(true);
    try {
      const response = await ChatHttpServer.register({
        username: username,
        password: password
      });
      props.loadingState(false);
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
      {error.trim() !== "" ? <p>{error}</p> : null}
      <div className="background-wrap">
        <div className="background"></div>
      </div>
      <form id="accesspanel">
        <h1 id="litheader">Register</h1>
        <div className="inset">
          <p>
            <input
              type="text"
              id="email"
              placeholder="Enter username"
              value={username}
              onChange={e => setUsername(e.target.value)}
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
        <p className="p-container">
          <button id="go" name="Login" onClick={handleRegistration}>
            Register
          </button>
        </p>
      </form>
    </div>
  );
};

export default withRouter(Registration);
