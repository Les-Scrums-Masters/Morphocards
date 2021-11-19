import React from "react";
import Firebase from "../Firebase";
import { signOut } from "firebase/auth"

export default class Navbar extends React.Component {

    async logOut() {
        await signOut(Firebase.auth);
    }

    render() {

        let login;

        if(this.props.isLogged) {
            login = (
                <div className="user-panel">
                    <h6>{Firebase.auth.currentUser.displayName}</h6>
                    <p>{Firebase.auth.currentUser.uid}</p>
                    <button className="logout-btn" onClick={this.logOut}>Deconnexion</button>
                </div>
            );
        }

        return(
            <nav>
                <h1>Morphocards Admin</h1>
                {login}
            </nav>
        );
    }

}