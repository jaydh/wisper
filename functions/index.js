const functions = require('firebase-functions');
const admin = require('firebase-admin');
const scrape = require('scrape-metadata');
const fetch = require('node-fetch');
const pos = require('pos');
const { Set, fromJS } = require('immutable');
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
      if (functions.database.ref('/userData/{uId}/articles/{articleID}')) {
        event.data.ref.parent.child('metadata').update(truthyMetadata);
        event.data.ref.parent.update({ fetching: false });
      }
    });
  });

exports.addKeywordsFromMetadata = functions.database.ref(
  '/userData/{uID}/articles/{articleID}/projects/{projectID}'.onCreate(
    event => {
      const project = event.data.val();
      const article = event.parent.parent.val();
      const metaToKeep = fromJS([
        'ogTitle',
        'title',
        'ogSiteName',
        'ogDescription',
        'description'
      ]);
      const tagsToKeep = fromJS(['JJ', 'NN', 'NNP', 'NNPS', 'VB']);
      const tagger = new pos.Tagger();
      console.log('test', project, article);

      firebase
        .database()
        .ref(
          '/userData/' +
            event.params.uID +
            '/projects/' +
            event.params.projectID
        )
        .once('value')
        .then(function(snapshot) {
          const dictionary = snapshot.val().dictionary;
          console.log('dictionary', dictionary);
          if (article.meta) {
            let newWords = fromJS(dictionary).valueSeq;
            const meta = fromJS(article.metadata);
            meta
              .keySeq()
              .filter(t => metaToKeep.includes(t))
              .forEach(t => {
                const words = new pos.Lexer().lex(meta.get(t));
                const taggedWords = fromJS(tagger.tag(words))
                  .filter(p => {
                    return tagsToKeep.includes(p.get(1));
                  })
                  .map(p => p.get(0));
                newWords = newWords.union(taggedWords.valueSeq());
              });
            console.log(newWords);
          }
        });
    }
  )
);
