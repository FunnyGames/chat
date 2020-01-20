import React, { Component } from "react";
import { withRouter } from "react-router-dom";

import { decrypt } from "../../utils/Des";
import ChatSocketServer from "../../services/ChatSocketServer";
import ChatHttpServer from "../../services/ChatHttpServer";

import ChatList from "./chat-list/ChatList";
import Conversation from "./conversation/Conversation";
import { Navbar } from "react-bootstrap";

import "./Chat.scss";

class Chat extends Component {
  _isMounted = false;
  state = {
    loadingState: true,
    conversations: [],
    selectedConversation: null,
    messages: [],
    keys: [],
    currentKey: ""
  };

  componentDidMount() {
    this._isMounted = true;
    this.connectToSocket();
    ChatSocketServer.eventEmitter.on(
      "chat-list-response",
      this.createChatListUsers
    );
    ChatSocketServer.eventEmitter.on(
      "chat-list-new-user",
      this.addUserToChatList
    );
    ChatSocketServer.eventEmitter.on(
      "chat-list-user-logout",
      this.userLogoutEvent
    );
    ChatSocketServer.eventEmitter.on(
      "add-message-response",
      this.updateMessage
    );
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  async connectToSocket() {
    try {
      this.setRenderLoadingState(true);
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
      ChatHttpServer.setLS("username", username);
      ChatSocketServer.establishSocketConnection(this.userId);
      ChatSocketServer.getChatList(this.userId);
      this.setRenderLoadingState(false);
    } catch (error) {
      console.log(error.response);
      this.setRenderLoadingState(false);
      this.props.history.push("/");
    }
  }

  createChatListUsers = chatListResponse => {
    if (this._isMounted) {
      this.setState({
        conversations: chatListResponse.chatList
      });
    }
  };

  addUserToChatList = user => {
    if (user._id === this.userId) return;
    let count = this.state.conversations.filter(u => u._id === user.info._id);
    let conversations;
    if (count.length === 0) {
      conversations = [...this.state.conversations, user.info];
    } else {
      conversations = [...this.state.conversations];
      for (let i = 0; i < conversations.length; ++i) {
        let c = conversations[i];
        if (c._id === user.info._id) {
          c.online = "Y";
          break;
        }
      }
    }
    if (this._isMounted) {
      this.setState({ conversations });
    }
  };

  userLogoutEvent = user => {
    let conversations = this.state.conversations;
    for (let i = 0; i < conversations.length; ++i) {
      let c = conversations[i];
      if (c._id === user.userId) {
        c.online = "N";
        break;
      }
    }
    if (this._isMounted) {
      this.setState({
        conversations: conversations
      });
    }
  };

  setRenderLoadingState = loadingState => {
    if (this._isMounted) {
      this.setState({ loadingState });
    }
  };

  checkKeys = userId => {
    for (let i = 0; i < this.state.keys.length; i++) {
      if (
        userId === this.state.keys[i].user1 ||
        userId === this.state.keys[i].user2
      ) {
        return this.state.keys[i].key;
      }
    }
    return false;
  };

  onConversationSelect = async conversation => {
    let key = this.checkKeys(conversation._id);
    if (!key) {
      let res = await ChatHttpServer.getKey(conversation._id);
      key = res.key;
    }
    if (this._isMounted) {
      this.setState({ selectedConversation: conversation, currentKey: key });
    }
    this.getMessages(conversation);
  };

  getMessages = async conversation => {
    try {
      const messageResponse = await ChatHttpServer.getMessages(
        this.userId,
        conversation._id
      );
      if (!messageResponse.error) {
        for (let i = 0; i < messageResponse.messages.length; ++i) {
          let msg = messageResponse.messages[i];
          msg.message = decrypt(this.state.currentKey, msg.message);
        }
        if (this._isMounted) {
          this.setState({
            messages: messageResponse.messages
          });
        }
        // this.scrollMessageContainer();
      } else {
        alert("Unable to fetch messages");
      }
      // this.setState({
      //     messageLoading: false
      // });
    } catch (error) {
      // this.setState({
      //     messageLoading: false
      // });
    }
  };

  sendMessage = event => {
    const message = event.target.value;
    if (message === "" || message === undefined || message === null) {
      event.target.value = "";
    } else if (this.state.userId === "") {
      this.router.navigate(["/"]);
    } else if (!this.state.selectedConversation) {
      alert(`Select a user to chat.`);
    } else {
      this.sendAndUpdateMessages({
        fromUserId: this.userId,
        message: message.trim(),
        toUserId: this.state.selectedConversation._id
      });
      event.target.value = "";
    }
  };

  sendAndUpdateMessages(message) {
    try {
      let key = this.state.currentKey;
      ChatSocketServer.sendMessage(key, message);
      if (this._isMounted) {
        this.setState({
          messages: [...this.state.messages, message]
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  updateMessage = message => {
    let c = this.state.selectedConversation;
    if (!c || message.fromUserId !== c._id) {
      return;
    }
    message.message = decrypt(this.state.currentKey, message.message);
    if (this._isMounted) {
      this.setState({
        messages: [...this.state.messages, message]
      });
    }
  };

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
      <div className="main">
        <nav className="navbar navbar-dark bg-dark fixed-top">
          <span className="navbar-brand mb-0 h1">
            Welcome {this.state.username}
          </span>
          <button
            className="btn btn-outline-danger my-2 my-sm-0"
            onClick={this.logout}
          >
            Logout
          </button>
        </nav>
        {this.state.loadingState ? (
          <div className="ui segment">
            <p></p>
            <div className="ui active inverted dimmer">
              <div className="ui loader"></div>
            </div>
          </div>
        ) : (
          <div>
            <div className="list">
              <ChatList
                onConversationSelect={this.onConversationSelect}
                conversations={this.state.conversations}
                selectedConversation={this.state.selectedConversation}
              />
            </div>
            <div className="chat">
              <Conversation
                conversation={this.state.selectedConversation}
                messages={this.state.messages}
                userId={this.userId}
                sendMessage={this.sendMessage}
              />
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default withRouter(Chat);
