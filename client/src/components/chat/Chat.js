import React, { Component } from 'react';
import { withRouter } from "react-router-dom";

import ChatSocketServer from '../../services/ChatSocketServer';
import ChatHttpServer from '../../services/ChatHttpServer';

import ChatList from './chat-list/ChatList';
import Conversation from './conversation/Conversation';

import './Chat.css';

class Chat extends Component {
    state = { loadingState: true, conversations: [], selectedConversation: null, messages: [], keys: [], currentKey: '' };
    
    componentDidMount() {
        this.connectToSocket();
        ChatSocketServer.eventEmitter.on('chat-list-response', this.createChatListUsers);
        ChatSocketServer.eventEmitter.on('chat-list-new-user', this.addUserToChatList);
        ChatSocketServer.eventEmitter.on('chat-list-user-logout', this.userLogoutEvent);
        ChatSocketServer.eventEmitter.on('add-message-response', this.updateMessage);
    }

    async connectToSocket() {
        try {
            this.setRenderLoadingState(true);
            this.userId = await ChatHttpServer.getUserId();
            let keys = await ChatHttpServer.getKeys();
            const response = await ChatHttpServer.userSessionCheck();
            if (response.error) {
                this.props.history.push(`/`)
            } else {
                this.setState({
                    username: response.username,
                    keys: keys
                });
                ChatHttpServer.setLS('username', response.username);
                ChatSocketServer.establishSocketConnection(this.userId);
                ChatSocketServer.getChatList(this.userId);
            }
            this.setRenderLoadingState(false);
        } catch (error) {
            console.log(error.response);
            this.setRenderLoadingState(false);
            this.props.history.push(`/`)
        }
    }

    createChatListUsers = (chatListResponse) => {
        this.setState({
            conversations: chatListResponse.chatList
        });
    }

    addUserToChatList = (user) => {
        console.log('addUserToChatList', this.state);
        let count = this.state.conversations.filter(u => u._id === user.info._id);
        let conversations;
        if (count === 0) {
            conversations = [...this.state.conversations, user.info];
        } else {
            conversations = [...this.state.conversations];
            for (let i = 0; i < conversations.length; ++i) {
                let c = conversations[i];
                if (c._id === user.info._id) {
                    c.online = 'Y';
                    break;
                }
            }
        }
        this.setState({ conversations });
    }

    userLogoutEvent = (user) => {
        let conversations = this.state.conversations;
        for (let i = 0; i < conversations.length; ++i) {
            let c = conversations[i];
            if (c._id === user.userId) {
                c.online = 'N';
                break;
            }
        }
        this.setState({
            conversations: conversations
        });
    }

    setRenderLoadingState = loadingState => {
        this.setState({ loadingState });
    }
    
    checkKeys = (userId) => {
        for(let i = 0; i < this.state.keys.length; i++){
            if(userId === this.state.keys[i].user1 || userId === this.state.keys[i].user2){
                return true;
            }
        }
        return false;
    }

    onConversationSelect = async conversation => {
        if(!this.checkKeys(conversation._id)){
            await ChatHttpServer.getKey(conversation._id);
        }
        this.setState({ selectedConversation: conversation });
        this.getMessages(conversation);
    };

    getMessages = async (conversation) => {
        try {
            const messageResponse = await ChatHttpServer.getMessages(this.userId, conversation._id);
            if (!messageResponse.error) {
                this.setState({
                    messages: messageResponse.messages,
                });
                // this.scrollMessageContainer();
            } else {
                alert('Unable to fetch messages');
            }
            // this.setState({
            //     messageLoading: false
            // });
        } catch (error) {
            // this.setState({
            //     messageLoading: false
            // });
        }
    }

    sendMessage = (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            const message = event.target.value;
            if (message === '' || message === undefined || message === null) {
                event.target.value = '';
            } else if (this.state.userId === '') {
                this.router.navigate(['/']);
            } else if (!this.state.selectedConversation) {
                alert(`Select a user to chat.`);
            } else {
                this.sendAndUpdateMessages({
                    fromUserId: this.userId,
                    message: (message).trim(),
                    toUserId: this.state.selectedConversation._id,
                });
                event.target.value = '';
            }
        }
    }

    sendAndUpdateMessages(message) {
        try {
            ChatSocketServer.sendMessage(message);
            this.updateMessage(message);
        } catch (error) {
            console.log(error);
        }
    }

    updateMessage = (message) => {
        this.setState({
            messages: [...this.state.messages, message]
        });
    }

    logout = async () => {
        try {
            await ChatHttpServer.removeLS();
            ChatSocketServer.logout({
                userId: this.userId
            });
            ChatSocketServer.eventEmitter.on('logout-response', (loggedOut) => {
                this.props.history.push(`/`);
            });
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    render() {
        return (
            <div>
                <center><h1>Welcome {this.state.username}</h1></center>
                <div className="ui container" style={{ paddingBottom: '10px' }}><button className="ui button" onClick={this.logout}>Logout</button></div>
                {this.state.loadingState ?
                    <div className="ui segment">
                        <p></p>
                        <div className="ui active inverted dimmer">
                            <div className="ui loader"></div>
                        </div>
                    </div>
                    :
                    <div className="ui container">
                        <div className="ui grid">
                            <div className="ui row">
                                <div className="five wide column">
                                    <ChatList
                                        onConversationSelect={this.onConversationSelect}
                                        conversations={this.state.conversations}
                                        selectedConversation={this.state.selectedConversation}
                                    />
                                </div>
                                <div className="eleven wide column">
                                    <Conversation
                                        conversation={this.state.selectedConversation}
                                        messages={this.state.messages}
                                        userId={this.userId}
                                        sendMessage={this.sendMessage}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </div>
        );
    }
}

export default withRouter(Chat);