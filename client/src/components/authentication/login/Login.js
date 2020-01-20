import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';

import ChatHttpServer from '../../../services/ChatHttpServer';
import './Login.css';

const Login = (props) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (event) => {
        event.preventDefault();
        props.setLoadingState(true);
        try {
            const response = await ChatHttpServer.login({ username: username, password: password });
            props.setLoadingState(false);
            setError('')
            ChatHttpServer.setLS('userid', response.userId);
            props.history.push(`/chat`);
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
                    onChange={(e) => { setUsername(e.target.value) }} />
                <input
                    className="input"
                    placeholder="Password"
                    type="password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value) }} />
                <button
                    className="button"
                    onClick={handleLogin}>Login</button>
            </form>
        </div>
    );
}

export default withRouter(Login);
