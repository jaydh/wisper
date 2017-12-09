import * as React from 'react';
import { auth } from '../firebase';
import { Button } from 'react-bootstrap';
export default class Logout extends React.Component {
  render() {
    return (
      <Button
        bsStyle="logout"
        bsSize="small"
        onClick={() =>
          auth()
            .signOut()
            .then(() => window.location.reload())}
      >
        Logout
      </Button>
    );
  }
}
