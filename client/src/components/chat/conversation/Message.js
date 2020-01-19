import React from 'react';
import moment from 'moment';

import './Message.css';

const Message = ({ message, isMe }) => {
    if (!message) {
        return <div></div>;
    }
    let content = message.message;
    let date = message.createDate;
    let classMessage = isMe ? 'green ' : 'yellow ';
    classMessage += 'ui message';
    let float = isMe ? 'right' : 'left';
    return (
        <div style={{ paddingTop: '0.5em', overflow: 'auto' }}>
            <div className={classMessage} style={{ width: 'max-content', float }}>
                <div className="content">
                    {content}
                </div>
                <div className="date">{moment(date).format('h:m')}</div>
            </div>
        </div>
    );
};

export default Message;