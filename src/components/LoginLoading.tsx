import * as React from 'react';
import { auth, provider } from '../firebase';
import { Button } from 'react-bootstrap';
export default class LoginLoading extends React.Component {
  render() {
    return (
      <div className="container-fluid login">
        <div className="well" style={{ maxWidth: 400, margin: 'auto' }}>
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
        </div>
      </div>
    );
  }
}
