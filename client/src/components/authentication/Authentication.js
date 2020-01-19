import React, { useState } from 'react';

import Login from './login/Login';
import Registration from './registration/Registration';

import './Authentication.css';


const Authentication = () => {
    const [toShow, setToShow] = useState("Registration");
    const [ loading, setLoading ] = useState(false);
    const changeToShow = (mode) => {
        setToShow(mode);
    }

    return (
        <div >
            <div className="authentication-screen">
                
                <div className="auth-container">
                    {loading ? <div>Loading . . .</div> : null}
                    <div className="auth-nav">
                        <div className="nav-button" onClick={() => changeToShow("Login")}>Login</div>
                        <div className="nav-button" onClick={() => changeToShow("Registration")}>Registration</div>
                    </div>

                    {toShow === "Login" ? <div className="form-container">
                        Login
                        <Login loadingState={(loadingState) => {setLoading(loadingState)}} setLoadingState={setLoading} /> 
                    </div> : null}

                    {toShow === "Registration"  ? <div className="form-container">
                        Registration
                        <Registration setToShow={setToShow} loadingState={(loadingState) => {setLoading(loadingState)}} setLoadingState={setLoading} />
                    </div> : null}
                    
                </div>
            </div>
        </div>

    );
}

export default Authentication;