import * as React from 'react';
import { auth } from '../firebase';

export default class Logout extends React.Component {
    render() {
        return (
            <div>
                <button
                    className="btn-large"
                    onClick={() => auth().signOut()}
                >
                    logout
                </button>
            </div>
        );
    }
}