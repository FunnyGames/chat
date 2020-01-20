import React, { useState } from 'react';

import ChatHttpServer from '../../services/ChatHttpServer';
import Login from './login/Login';
import Registration from './registration/Registration';

import './Authentication.css';


const Authentication = (props) => {
    const [toShow, setToShow] = useState("Login");
    const [loading, setLoading] = useState(false);
    const changeToShow = (mode) => {
        setToShow(mode);
    }

    ChatHttpServer.getUser().then(({ userId, username }) => {
        if (userId && username) {
            props.history.push(`/chat`);
        }
    }).catch(() => { });

    return (
        <div >
            <div className="authentication-screen">

                <div className="auth-container">
                    {loading ? <div>Loading . . .</div> : null}
                    <div className="auth-nav">
                        <div className="nav-button" onClick={() => changeToShow("Login")}>Login</div>
                        <div className="nav-button" onClick={() => changeToShow("Registration")}>Register</div>
                    </div>

                    {toShow === "Login" ? <div className="form-container">
                        Login
                        <Login loadingState={(loadingState) => { setLoading(loadingState) }} setLoadingState={setLoading} />
                    </div> : null}

                    {toShow === "Registration" ? <div className="form-container">
                        Register
                        <Registration setToShow={setToShow} loadingState={(loadingState) => { setLoading(loadingState) }} setLoadingState={setLoading} />
                    </div> : null}

                </div>
            </div>
        </div>

    );
}

export default Authentication;