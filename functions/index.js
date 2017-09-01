const functions = require('firebase-functions');
const admin = require('firebase-admin');
const scrape = require('scrape-metadata');
const fetch = require('node-fetch');

admin.initializeApp(functions.config().firebase);

exports.getMetadata = functions.database
  .ref('/userData/{uId}/articles/{articleID}/link')
  .onCreate(event => {
    const article = event.data.val();
    event.data.ref.parent.update({ fetching: true });
    return scrape(article, (err, meta) => {
      truthyMetadata = {};
      Object.keys(meta).forEach(function(key) {
        if (meta[key]) {
          truthyMetadata[key] = meta[key];
        }
      });
      // check if article was deleted before metadata was being processed
      if (functions.database.ref('/userData/{uId}/articles/{articleID}/link')) {
        event.data.ref.parent.child('metadata').update(truthyMetadata);
        event.data.ref.parent.update({ fetching: false });
      }
    });
  });

exports.getSynonyms = functions.database
  .ref('/userData/{uId}/projects/{projectID}')
  .onCreate(event => {
    const headers = {
      Accept: 'application/json',
      app_id: 'eecc7bef',
      app_key: 'd0f53a6b78438907fa65047fc4e49967'
    };
    const myInit = {
      headers: headers,
      mode: 'no-cors',
      cache: 'default'
    };
    const project = event.params.projectID;
    return fetch(
      'http://words.bighugelabs.com/api/2/b0ccfcccd889eeb6a11c013493465013/' +
        event.data.val() +
        '/json',
      myInit
    )
      .then(function(response) {
        return response.json();
      })
      .then(function(text) {
        event.data.ref.set( text );
      });
  });
