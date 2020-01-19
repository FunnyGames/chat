import React from 'react';

import Message from './Message';

import './Conversation.css';

const Conversation = ({ conversation, messages, userId, sendMessage }) => {
    if (!conversation) {
        return <div></div>;
    }
    if (!messages) {
        messages = [];
    }
    const renderedList = messages.map(msg => {
        const isMe = userId === msg.fromUserId;
        return (
            <Message
                message={msg}
                isMe={isMe}
            />
        );
    });
    let title = conversation.username;
    return (
        <div key={conversation._id}>
            <div className="ui segment">
                <div className="ui header"><center>{title}</center></div>
                <div className="ui segment">
                    <div className="ui feed">
                        {renderedList}
                    </div>
                </div>
            </div>
            <form className="ui reply form">
                <div className="field">
                    <textarea rows="2" placeholder="Write here and press enter to send..." onKeyPress={sendMessage}></textarea>
                </div>
            </form>
        </div>
    );
};

export default Conversation;