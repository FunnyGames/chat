import React, { useEffect } from 'react';
import { useToasts } from 'react-toast-notifications'

import './ToastContainer.css';

const ToastContainer = (props) => {
    return (
        <div className="toast-container">
            {props.children}
        </div>
    );
};

export default ToastContainer;