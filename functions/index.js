const functions = require('firebase-functions');
const admin = require('firebase-admin');
const scrape = require('scrape-metadata');
const fetch = require('node-fetch');
const pos = require('pos');
const { Set, List, fromJS } = require('immutable');
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

exports.addKeywordsFromMetadata = functions.database
  .ref('/userData/{uID}/articles/{articleID}/projects/{projectID}')
  .onCreate(event => {
    const userDataRef = event.data.ref.parent.parent.parent.parent;
    return userDataRef.once('value').then(function(snapshot) {
      const project = event.data.val();
      const metaToKeep = fromJS([
        'ogTitle',
        'title',
        'ogSiteName',
        'ogDescription',
        'description'
      ]);
      const tagsToKeep = fromJS(['JJ', 'NN', 'NNP', 'NNPS', 'VB']);
      const tagger = new pos.Tagger();
      const userData = snapshot.val();
      const article = userData.articles[event.params.articleID];
      const [projectKey, projectValue] = fromJS(userData['projects']).findEntry(
        t => t.get('id') === project
      );
      const dictionary = projectValue.get('dictionary');
      if (article.metadata) {
        let newWords = Set(dictionary);
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
        userDataRef
          .child('projects')
          .child(projectKey)
          .update({ dictionary: newWords.toJS() });
      }
    });
  });

/*
exports.getSynonyms = functions.database
  .ref('/userData/{uID}/projects/{projectID}')
  .onCreate(event => {
    fetch(
      'http://words.bighugelabs.com/api/2/b0ccfcccd889eeb6a11c013493465013/' +
        event.params.projectID +
        '/json'
    )
      .then(function() {
        return response.json();
      })
      .then(function() {
        let dictionary = fromJS([]);
        const synonymGroups = fromJS(json).toList();
        synonymGroups.forEach(t => {
          dictionary = dictionary.merge(t.get('syn'));
        });
        return dictionary;
      })
      .then(function(dictionary) {
        event.data.ref.set({
          dictionary: dictionary.valueSeq().toJS()
        });
      });
  });*/
