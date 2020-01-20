import React, { useEffect } from 'react';
import ScrollableFeed from 'react-scrollable-feed'
import Message from './Message';
import uuid from 'uuid';
import { useToasts } from 'react-toast-notifications'

import './Conversation.css';


const Conversation = ({ conversation, messages, userId, sendMessage, errorMessage }) => {
    const { addToast } = useToasts();

    useEffect(() =>{
        if(errorMessage !== ""){
            addToast(errorMessage , { appearance: 'error', placement : 'bottom-center'})
        }
    },[errorMessage])

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
                <div className="ui header"><center>{title}</center></div>
                <div className="ui segment" style={{ maxHeight: '460px' }}>
                    <ScrollableFeed className="scrollable">
                        {renderedList}
                    </ScrollableFeed>
                </div>
            </div>
            <form className="ui reply form">
                <div className="field">
                    <textarea rows="2" placeholder="Write here and press enter to send..." onKeyUp={scrollToBottom}></textarea>
                </div>
            </form>
        </div>
    );
};

export default Conversation;