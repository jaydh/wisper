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
import { initFirebase, auth, provider } from './firebase'
let store = createStore(
    appReducer,
    compose(
        applyMiddleware(logger, thunk),
        autoRehydrate()
    )
);
persistStore(store);
initFirebase();
auth().onAuthStateChanged(function (user: any) {
    if (user) {
        ReactDOM.render(
            <Provider store={store}>
                <App />
            </Provider>,
            document.getElementById('root'))
    } else {
        ReactDOM.render(
            <p>
                Please login
            </p>,
            document.getElementById('root'));
        auth().signInWithRedirect(provider);
    }
});


registerServiceWorker();
