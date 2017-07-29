var firebase = require('firebase');
var config = {
    apiKey: 'AIzaSyBIdV-rYBcjbzaLo55lEx-Flyaj-Uxp6hg',
    authDomain: 'wisper-ffe5b.firebaseapp.com',
    databaseURL: 'https://wisper-ffe5b.firebaseio.com',
    projectId: 'wisper-ffe5b',
    storageBucket: 'wisper-ffe5b.appspot.com',
    messagingSenderId: '844031835377'
};

export const provider = new firebase.auth.GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
firebase.initializeApp(config);

export const initFirebase = () => {
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
        .then(function () {
        });

}

export const auth = firebase.auth;
export const database = firebase.database();
