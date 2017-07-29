import * as React from 'react';
import * as ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import { applyMiddleware, compose, createStore } from 'redux';
import { Provider } from 'react-redux';
import App from './components/App';
import appReducer from './reducers/index';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import { persistStore, autoRehydrate } from 'redux-persist';
import { initFirebase, auth, provider } from './firebase';
import LoginLoading from './components/LoginLoading';

let store = createStore(
    appReducer,
    compose(
        applyMiddleware(logger, thunk),
        autoRehydrate()
    )
);
initFirebase();
let persistor = persistStore(store);
auth().onAuthStateChanged(function (user: any) {
    if (user) {
        ReactDOM.render(
            <Provider store={store}>
                <App />
            </Provider>,
            document.getElementById('root'));
    } else {
        persistor.purge();
        ReactDOM.render(
            <LoginLoading />,
            document.getElementById('root')
        );

        auth().signInWithRedirect(provider);
    }
});

registerServiceWorker();
