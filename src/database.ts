var firebase = require('firebase');
var config = {
  apiKey: 'AIzaSyBIdV-rYBcjbzaLo55lEx-Flyaj-Uxp6hg',
  authDomain: 'wisper-ffe5b.firebaseapp.com',
  databaseURL: 'https://wisper-ffe5b.firebaseio.com',
  projectId: 'wisper-ffe5b',
  storageBucket: 'wisper-ffe5b.appspot.com',
  messagingSenderId: '844031835377'
};
firebase.initializeApp(config);
const database = firebase.database();
export default database;