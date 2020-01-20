import React from 'react';
import ScrollableFeed from 'react-scrollable-feed';
import Message from './Message';
import uuid from 'uuid';

import "./Conversation.css";
import "../Chat.scss";

const Conversation = ({ conversation, messages, userId, sendMessage }) => {
    const scrollToBottom = (event) => {
        if (event && event.key === 'Enter' && !event.shiftKey) {
            sendMessage(event);
        }
    }

    if (!conversation) {
        conversation = {
            _id: '', username: '- Select User -', online: 'N'
        }
    }
    if (!messages) {
        messages = [];
    }
    const renderedList = messages.map(msg => {
        const isMe = userId === msg.fromUserId;
        return (
            <Message
                key={uuid()}
                message={msg}
                isMe={isMe}
            />
        );
    });

    let title = conversation.username;
    return (
        <div key={conversation._id}>
            <div className="ui segment">
                <div className="ui header">
                    <center>{title}</center>
                </div>
                <div className="ui segment" style={{ maxHeight: "460px" }}>
                    <ScrollableFeed className="scrollable">{renderedList}</ScrollableFeed>
                </div>
            </div>
            <div class="chat-message clearfix">
                <textarea
                    name="message-to-send"
                    id="message-to-send"
                    placeholder="Type your message and press Enter"
                    rows="3"
                    onKeyUp={scrollToBottom}
                ></textarea>
            </div>
        </div>
    );
};

export default Conversation;
