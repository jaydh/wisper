import * as React from 'react';
import * as ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import { applyMiddleware, createStore } from 'redux';
import { Provider } from 'react-redux';
import App from './components/App';
import appReducer from './reducers/index';
import thunk from 'redux-thunk';
import { persistStore, autoRehydrate } from 'redux-persist-immutable';
import { initFirebase, auth, database } from './firebase';
import { composeWithDevTools } from 'redux-devtools-extension';
import demo from './constants/demo';
import 'bootstrap/dist/css/bootstrap.css';
import './css/styles.css';
import { persistReducer } from 'redux-persist';
import * as storage from 'localforage';

const persistConfig = {
  key: 'root',
  storage: storage
};
const persistedReducer = persistReducer(persistConfig, appReducer);

const store = createStore(
  persistedReducer,
  composeWithDevTools(applyMiddleware(thunk)),
  autoRehydrate()
);
initFirebase();
const persistor = persistStore(store);
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
      store.dispatch({ type: 'USER_LOGOUT' });
    }
    ReactDOM.render(
      <Provider store={store}>
        <App />
      </Provider>,
      document.getElementById('root')
    );
  });
} catch (e) {
  store.dispatch({ type: 'USER_LOGOUT' });
  console.log(e);
}

registerServiceWorker();
