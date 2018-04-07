import * as React from 'react';
import { auth } from '../firebase';
import Menu from '../containers/Menu';
import GitInfo from './GitInfo';
import '!!style-loader!css-loader!../css/styles.css';
import * as Loadable from 'react-loadable';
import Icon from 'react-fa';
import { Container } from 'reactstrap';

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
