const functions = require('firebase-functions');
const admin = require('firebase-admin');
const scrape = require('scrape-metadata');

admin.initializeApp(functions.config().firebase);

exports.getMetadata = functions.database
  .ref('/userData/{uId}/articles/{articleID}/link')
  .onCreate(event => {
    const article = event.data.val();
    event.data.ref.parent.set({fetching:true});
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
        event.data.ref.parent.set({fetching:false});
        
      }
    });
  });
