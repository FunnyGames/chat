import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import ChatSocketServer from "./services/ChatSocketServer";
import ChatHttpServer from "./services/ChatHttpServer";
import Authentication from "./components/authentication/Authentication";
import Chat from "./components/chat/Chat";
import NotFound from "./components/not-found/NotFound";
import "./App.css";

class App extends Component {
  state = {};

  async componentDidMount() {
    let { userId, username } = await ChatHttpServer.getUser();
    this.userId = userId;
    if (!username) {
      const response = await ChatHttpServer.userSessionCheck();
      username = response.username;
    }
    const { keys } = await ChatHttpServer.getKeys();
    if (this._isMounted) {
      this.setState({
        username: username,
        keys: keys
      });
    }
  }
  logout = async () => {
    try {
      await ChatHttpServer.removeLS();
      ChatSocketServer.logout({
        userId: this.userId
      });
      ChatSocketServer.eventEmitter.on("logout-response", loggedOut => {
        this.props.history.push(`/`);
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
  render() {
    return (
      <Router>
        <Switch>
          <Route path="/" exact component={Authentication} />
          <Route path="/chat/" component={Chat} />
          <Route component={NotFound} />
        </Switch>
      </Router>
    );
  }
}

export default App;
