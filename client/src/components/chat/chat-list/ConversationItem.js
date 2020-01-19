import React from 'react';

import './ConversationItem.css';

const ConversationItem = ({ conversation, isSelected, onConversationSelect }) => {
    if (!conversation) {
        return <div></div>;
    }
    let classOnline = conversation.online === 'Y' ? 'online' : 'offline';
    let itemSelected = isSelected ? 'selected ' : '';
    itemSelected += 'item';
    return (
        <div onClick={() => onConversationSelect(conversation)} className={itemSelected} style={{ paddingTop: '12px', minHeight: '40px' }}>
            <div className="content">
                <span className={classOnline}></span>
                <div className="header">{conversation.username}</div>
            </div>
        </div>
    );
};

export default ConversationItem;