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

interface result {
    user: string
}
interface error {
    code: string;
    message: string;
    email: string;
    credential: string;
}

firebase.initializeApp(config);
firebase.auth().onAuthStateChanged(function (user: any) {
    if (user) {

    } else {
        firebase.auth().signInWithPopup(provider).then(function (result: result) {

        }).catch(function (error: error) {
            console.log(error)

        });
    }
});

export const auth = firebase.auth;
export const database = firebase.database();
