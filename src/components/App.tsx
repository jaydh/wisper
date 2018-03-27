import * as React from 'react';
import { auth } from '../firebase';
import Menu from '../containers/Menu';
import GitInfo from './GitInfo';
import '!!style-loader!css-loader!../css/styles.css';
import * as Loadable from 'react-loadable';
import Icon from 'react-fa';

const AsyncLoading = Loadable({
  loader: () => import('./LoginLoading'),
  loading: Icon
});
const AsyncAppRoutes = Loadable({
  loader: () => import('../containers/AppRoutes'),
  loading: Icon
});

export default class App extends React.Component {
  render() {
    return (
      <div
        className="container-fluid app-container"
        style={{ backgroundColor: '#ECF0F1' }}
      >
        {auth().currentUser ? (
          <>
            <Menu
              user={
                auth()!.currentUser!.displayName
                  ? auth()!.currentUser!.displayName
                  : 'Demo'
              }
            />
            <AsyncAppRoutes />
          </>
        ) : (
          <AsyncLoading />
        )}
        <GitInfo />
      </div>
    );
  }
}
