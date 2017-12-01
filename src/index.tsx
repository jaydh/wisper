import * as React from 'react';
import * as ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import { applyMiddleware, createStore } from 'redux';
import { Provider } from 'react-redux';
import App from './components/App';
import appReducer from './reducers/index';
import thunk from 'redux-thunk';
const { persistStore, autoRehydrate } = require('redux-persist-immutable');
import { initFirebase, auth, database } from './firebase';
import { composeWithDevTools } from 'redux-devtools-extension';
import bootstrap from './bootstrap';
import demo from './constants/demo';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import './css/styles.css';
bootstrap();

let store = createStore(
  appReducer,
  composeWithDevTools(applyMiddleware(thunk)),
  autoRehydrate()
);
initFirebase();
let persistor = persistStore(store);
try {
  auth().onAuthStateChanged(function(user: any) {
    if (user) {
      if (user.isAnonymous) {
        database
          .ref('/userData/' + user.uid)
          .once('value')
          .then(function(snapshot: any) {
            if (!snapshot.val()) {
              demo(store, persistor);
            }
          });
      }
    } else {
      persistor.purge();
    }
    ReactDOM.render(
      <Provider store={store}>
        <App />
      </Provider>,
      document.getElementById('root')
    );
  });
} catch (e) {
  console.log(e);
  persistor.purge();
}

registerServiceWorker();
