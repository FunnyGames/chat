import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Authentication from "./components/authentication/Authentication";
import Chat from "./components/chat/Chat";
import NotFound from "./components/not-found/NotFound";

import "./App.css";

class App extends Component {
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
