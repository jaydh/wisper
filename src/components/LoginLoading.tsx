import * as React from 'react';
import { auth, provider } from '../firebase';
import GitInfo from './GitInfo';
import { Card, Button } from 'reactstrap';
export default class LoginLoading extends React.Component {
  render() {
    return (
      <Card style={{ maxWidth: '40rem', margin: 'auto' }}>
        <Button
          bsStyle="daily"
          bsSize="large"
          onClick={() => auth().signInWithRedirect(provider)}
          block={true}
        >
          Continue with Google Authentication{' '}
        </Button>
        <Button
          bsStyle="daily"
          bsSize="large"
          onClick={() => auth().signInAnonymously()}
          block={true}
        >
          Demo{' '}
        </Button>
        <br />
        <p>
          Wispy uses Google authentication to identify users without requesting
          user data. We redirect you to authenticate with google, generate a
          user id, and recieve the authentication response from Google.
          <br />
          The demo is a demonstration of Wispy that dynamically simulates user
          data. Actions are triggered in real time and the data is persistent
          and fully tied to each demo account.
          <br />
        </p>
        <GitInfo />
      </Card>
    );
  }
}
