import React from "react";
import Firebase from "../Firebase";
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

export default class LoginPage extends React.Component {

    render() {

        return (
            <div id="login">
                <StyledFirebaseAuth uiConfig={Firebase.uiConfig} firebaseAuth={Firebase.auth} />
            </div>
        );
    }

} 