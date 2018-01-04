import * as React from 'react';
import AddDaily from '../containers/actionDispatchers/AddDaily';
import DeleteDaily from '../containers/actionDispatchers/DeleteDaily';
import DeleteUserData from '../containers/actionDispatchers/DeleteUserData';

class UserPage extends React.Component {
  render() {
    return (
      <div>
        <AddDaily />
        <DeleteDaily />
        <DeleteUserData />
      </div>
    );
  }
}

export default UserPage;
