import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';

import ChatHttpServer from '../../../services/ChatHttpServer';
import './Registration.css';

const Registration = (props) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');


    const handleRegistration = async (event) => {
        event.preventDefault();
        props.loadingState(true);
        try {
            const response = await ChatHttpServer.register({ username: username, password: password });
            props.loadingState(false);
            setError('');
            ChatHttpServer.setLS('userid', response.userId);
            props.history.push(`/chat`)
        } catch (error) {
            props.setLoadingState(false);
            setError(error.response.data.message)

        }
    }

    return (
        <div className="container">
            {error.trim() !== "" ? <p>{error}</p> : null}
            <form>
                <input
                    className="input"
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)} />
                <input
                    className="input"
                    placeholder="Password"
                    type="password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value) }} />
                <button
                    className="button"
                    onClick={handleRegistration}>Register</button>
            </form>
        </div>
    );
}

export default withRouter(Registration)
