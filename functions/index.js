const functions = require('firebase-functions');
const admin = require('firebase-admin');
const scrape = require('scrape-metadata');

admin.initializeApp(functions.config().firebase);

exports.getMetadata = functions.database
  .ref('/userData/{uId}/articles/{articleID}/link')
  .onCreate(event => {
    const article = event.data.val();
    return scrape(article, (err, meta) => {
      console.log(meta);
      event.data.ref.parent.child('metadata').update(meta);
    });
  });
