import * as React from 'react';
import { auth, provider } from '../firebase';
export default class LoginLoading extends React.Component {
    render() {
        return (
            <div>
                <h2> Please login </h2>
                <button
                    className="btn btn-primary btn-lg"
                    onClick={() => auth().signInWithRedirect(provider)}
                >
                    Login through google
                </button>
            </div>
        );
    }
}