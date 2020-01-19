import React from 'react';

import ConversationItem from './ConversationItem';

import './ChatList.css';

const ChatList = ({ conversations, selectedConversation, onConversationSelect }) => {
    const renderedList = conversations.map(conversation => {
        const isSelected = conversation === selectedConversation;
        return (
            <ConversationItem
                key={conversation._id}
                onConversationSelect={onConversationSelect}
                conversation={conversation}
                isSelected={isSelected}
            />
        );
    });

    return (
        <div>
            <div>Users:</div>
            <div className="ui middle celled animated list">{renderedList}</div>
        </div>
    );
};

export default ChatList;