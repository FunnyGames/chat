import React from 'react';

import './ToastContainer.css';

const ToastContainer = (props) => {
    return (
        <div className="toast-container">
            {props.children}
        </div>
    );
};

export default ToastContainer;