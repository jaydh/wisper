import * as React from 'react';
import * as ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import { applyMiddleware, createStore } from 'redux';
import { Provider } from 'react-redux';
import App from './components/App';
import appReducer from './reducers/index';
import thunk from 'redux-thunk';
// let { persistStore, autoRehydrate } = require('redux-persist-immutable');
import { initFirebase, auth } from './firebase';
import LoginLoading from './components/LoginLoading';
import { composeWithDevTools } from 'redux-devtools-extension';
import bootstrap from './bootstrap';
bootstrap();

let store = createStore(
  appReducer,
  composeWithDevTools(applyMiddleware(thunk))
);
initFirebase();
// let persistor = persistStore(store);
auth().onAuthStateChanged(function(user: any) {
  if (user) {
    ReactDOM.render(
      <Provider store={store}>
        <App />
      </Provider>,
      document.getElementById('root')
    );
  } else {
    // persistor.purge();
    ReactDOM.render(<LoginLoading />, document.getElementById('root'));
  }
});

registerServiceWorker();
