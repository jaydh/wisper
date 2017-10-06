import * as React from 'react';
import { auth, provider } from '../firebase';
import { Button } from 'react-bootstrap';
export default class LoginLoading extends React.Component {
  componentWillUnmount() {
    window.location.reload();
  }
  render() {
    const wellStyles = { maxWidth: 400, margin: 'auto' };
    return (
      <div className="well" style={wellStyles}>
        <h2> Create account</h2>
        <Button
          bsStyle="primary"
          bsSize="large"
          onClick={() => auth().signInWithRedirect(provider)}
          block={true}
        >
          Login{' '}
        </Button>

        <Button
          bsStyle="primary"
          bsSize="large"
          onClick={() => auth().signInAnonymously()}
          block={true}
        >
          Try anonymously
        </Button>
      </div>
    );
  }
}
