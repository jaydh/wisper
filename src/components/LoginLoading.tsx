import * as React from 'react';
import { auth, provider } from '../firebase';
import { Well, Button } from 'react-bootstrap';
export default class LoginLoading extends React.Component {
  render() {
    return (
      <div className="container-fluid login">
        <Well style={{ maxWidth: '40rem', margin: 'auto' }}>
          <Button
            bsStyle="daily"
            bsSize="large"
            onClick={() => auth().signInWithRedirect(provider)}
            block={true}
          >
            Authenticate with Google{' '}
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
            Wispy uses Google authentication to identify users and doesn't
            request any user data from Google
            <br />
            The demo is a demonstration of Wispy that dynamically simulates user
            data. Actions are triggered in real time and the data is persistent
            and fully tied to each demo account.
          </p>
        </Well>
      </div>
    );
  }
}
