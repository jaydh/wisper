import * as React from 'react';
import LoginLoading from './LoginLoading';
import { auth } from '../firebase';
import Menu from '../containers/Menu';
import GitInfo from './GitInfo';
import AppRoutes from '../containers/AppRoutes';
import '!!style-loader!css-loader!../css/styles.css';

export default class App extends React.Component {
  render() {
    return (
      <div className="container-fluid app-container">
        {auth().currentUser ? (
          <div>
            <Menu
              user={
                auth()!.currentUser!.displayName
                  ? auth()!.currentUser!.displayName
                  : 'Demo'
              }
            />
            <AppRoutes />
            <GitInfo />
          </div>
        ) : (
          <LoginLoading />
        )}
      </div>
    );
  }
}
