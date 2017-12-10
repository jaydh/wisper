import * as React from 'react';
import DeleteUserData from '../containers/actionDispatchers/DeleteUserData';

class UserPage extends React.Component {
  render() {
    return (
      <div>
        <DeleteUserData />
      </div>
    );
  }
}

export default UserPage;
