import * as React from 'react';
import { auth } from '../firebase';
import { Button } from 'react-bootstrap';
export default class Logout extends React.Component {
    render() {
        return (
            <div>
                <Button
                    className="btn-large"
                    onClick={() => auth().signOut()}
                >
                    logout
                </Button>
            </div>
        );
    }
}