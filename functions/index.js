const functions = require('firebase-functions');
const admin = require('firebase-admin');
const scrape = require('scrape-metadata');
const fetch = require('node-fetch');
const pos = require('pos');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const readability = require('readability-node');
const Readability = readability.Readability;
const { Map, Set, List, fromJS } = require('immutable');
admin.initializeApp(functions.config().firebase);

exports.getMetadata = functions.database
  .ref('/userData/{uId}/articles/{articleID}/link')
  .onCreate(event => {
    const article = event.data.val();
    event.data.ref.parent.update({ fetching: true });
    const metaRef = event.data.ref.parent.child('metadata');
    const rootRef = event.data.ref.parent.parent.parent.parent.parent;
    const htmlRef = rootRef
      .child('articleHTMLData')
      .child(event.params.articleID)
      .child('HTMLContent');
    return Promise.all([
      new Promise(function(resolve, reject) {
        scrape(article, (err, meta) => {
          // Filters out null/undefined values
          const filteredMeta = fromJS(meta)
            .filter(t => t)
            .toJS();
          resolve(metaRef.set(filteredMeta));
        });
      }),
      htmlRef.once('value', snapshot => snapshot.val() !== null).then(
        exists =>
          exists
            ? JSDOM.fromURL(article, {}).then(dom => {
                const loc = dom.window.location;
                var uri = {
                  spec: loc.href,
                  host: loc.host,
                  prePath: loc.protocol + '//' + loc.host,
                  scheme: loc.protocol.substr(0, loc.protocol.indexOf(':')),
                  pathBase:
                    loc.protocol +
                    '//' +
                    loc.host +
                    loc.pathname.substr(0, loc.pathname.lastIndexOf('/') + 1)
                };
                const article = new Readability(
                  uri,
                  dom.window.document
                ).parse();
                return htmlRef.set(article.content);
              })
            : null
      )
    ]).then(() => event.data.ref.parent.child('fetching').set(false));
  });

exports.refetchHTML = functions.database
  .ref('/userData/{uId}/articles/{articleID}/refetch')
  .onCreate(event => {
    const rootRef = event.data.ref.parent.parent.parent.parent.parent;
    const htmlRef = rootRef
      .child('articleHTMLData')
      .child(event.params.articleID)
      .child('HTMLContent');
    return event.data.ref.parent
      .child('link')
      .once('value')
      .then(snapshot =>
        event.data.ref.parent
          .child('fetching')
          .set(true)
          .then(() =>
            JSDOM.fromURL(snapshot.val(), {})
              .then(dom => {
                const loc = dom.window.location;
                var uri = {
                  spec: loc.href,
                  host: loc.host,
                  prePath: loc.protocol + '//' + loc.host,
                  scheme: loc.protocol.substr(0, loc.protocol.indexOf(':')),
                  pathBase:
                    loc.protocol +
                    '//' +
                    loc.host +
                    loc.pathname.substr(0, loc.pathname.lastIndexOf('/') + 1)
                };
                const article = new Readability(
                  uri,
                  dom.window.document
                ).parse();
                return htmlRef.set(article.content);
              })
              .then(() => event.data.ref.parent.child('refetch').remove())
              .then(() => event.data.ref.parent.child('fetching').set(false))
          )
      );
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
