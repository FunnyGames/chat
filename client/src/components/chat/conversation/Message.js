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
    return (
        <div style={{ width: 'max-content', paddingTop: '0.5em' }}>
            <div key={message._id} className={classMessage} style={{ width: 'fit-content' }}>
                <div className="content">
                    {content}
                </div>
                <div className="date">{moment(date).format('h:m')}</div>
            </div>
        </div>
    );
};

export default Message;