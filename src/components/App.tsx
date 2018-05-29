import * as React from 'react';
import { auth } from '../firebase';
import Menu from '../containers/Menu';
import GitInfo from './GitInfo';
import * as Loadable from 'react-loadable';
import { Container } from 'reactstrap';

const AsyncLoading = Loadable({
  loader: () => import('./LoginLoading'),
  loading() {
    return <div>Loading...</div>;
  }
});
const AsyncAppRoutes = Loadable({
  loader: () => import('../containers/AppRoutes'),
  loading() {
    return <div>Loading...</div>;
  }
});

export default class App extends React.Component {
  render() {
    return (
      <Container
        fluid={true}
        style={{ width: '100vw', backgroundColor: '#ECF0F1' }}
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
      </Container>
    );
  }
}
