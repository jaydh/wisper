import * as React from 'react';
import { auth, provider } from '../firebase';
import { Button } from 'react-bootstrap';
export default class LoginLoading extends React.Component {
  render() {
    return (
      <div>
        <h2> Please login </h2>
        <Button onClick={() => auth().signInWithRedirect(provider)}>
          Continue with Google authentication
        </Button>
      </div>
    );
  }
}
