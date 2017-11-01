const functions = require('firebase-functions');
const admin = require('firebase-admin');
const scrape = require('scrape-metadata');
const fetch = require('node-fetch');
const pos = require('pos');
const { Map, Set, List, fromJS } = require('immutable');
admin.initializeApp(functions.config().firebase);

exports.getMetadata = functions.database
  .ref('/userData/{uId}/articles/{articleID}/link')
  .onCreate(event => {
    const article = event.data.val();
    event.data.ref.parent.update({ fetching: true });

    const promise = new Promise(function(resolve, reject) {
      scrape(article, (err, meta) => {
        let updates = {};
        // Filters out null/undefined values
        updates['/metadata/'] = fromJS(meta)
          .filter(t => t)
          .toJS();
        updates['/fetching'] = false;

        resolve(updates);
      });
    }).then(updates => event.data.ref.parent.update(updates));
    return promise;
  });

exports.addKeywordsFromMetadata = functions.database
  .ref('/userData/{uID}/articles/{articleID}/projects/{projectID}')
  .onCreate(event => {
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

    const articleRef = event.data.ref.parent.parent;
    const masterProjectRef = event.data.ref.parent.parent.parent.parent.child(
      'projects'
    );

    return masterProjectRef
      .once('value')
      .then(function(snapshot) {
        const [key, value] = fromJS(snapshot.val()).findEntry(
          t => t.get('id') === project
        );
        const dictionary = value.get('dictionary');
        if (dictionary) return { key, dictionary };
      })
      .then(projectData =>
        articleRef.once('value').then(function(snapshot) {
          const article = snapshot.val();
          let updatedDictionary = projectData.dictionary;
          if (article.metadata) {
            let newWords = Set(projectData.dictionary);
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
            updatedDictionary = newWords.toJS();
          }
          return {
            key: projectData.key,
            dictionary: updatedDictionary
          };
        })
      )
      .then(updates => {
        masterProjectRef
          .child(updates.key)
          .update({ dictionary: updates.dictionary });
      });
  });

exports.getProjectSynonyms = functions.database
  .ref('/userData/{uID}/projects/{projectPushID}')
  .onCreate(event => {
    const project = event.data.val().id;
    // Gets dictionary data for project and updates project dicionary accordingly
    return fetch(
      `https://words.bighugelabs.com/api/2/b0ccfcccd889eeb6a11c013493465013/${project}/json`
    )
      .then(function(response) {
        return response.json();
      })
      .then(function(json) {
        let dictionary = fromJS([]);
        const synonymGroups = fromJS(json).toList();
        synonymGroups.forEach(t => {
          dictionary = dictionary.merge(t.get('syn'));
        });
        return dictionary;
      })
      .then(function(dictionary) {
        event.data.ref.set({
          id: project,
          dictionary: dictionary.valueSeq().toJS()
        });
      });
  });
