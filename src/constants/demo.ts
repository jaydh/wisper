import addArticle from '../actions/articles/addArticle';
import {
  addArticleList,
  repositionArticleList,
  resizeArticleList
} from '../actions/articleList';
import setSortFilter from '../actions/setSortFilter';
import { setProjectFilter } from '../actions/projectFilter';
import { setVisibilityFilter } from '../actions/visibilityFilter';

export default function(store: any, persistor: any) {
  persistor.purge();

  store.dispatch(
    addArticle(
      'https://lbpost.com/life/pets/2000011459-pet-store-bill-passes-california-senate-38-to-0',
      'news'
    )
  );
  store.dispatch(
    addArticle(
      'https://www.independent.co.uk/news/uk/home-news/billy-caldwell-cannabis-oil-boy-seizures-stopped-cured-prescription-medical-marijuana-a7933066.html',
      'news'
    )
  );
  store.dispatch(
    addArticle(
      'https://www.theguardian.com/us-news/2017/aug/16/kkk-permit-denied-cross-burning-stone-mountain-georgia',
      'news'
    )
  );
  store.dispatch(
    addArticle(
      'https://www.bloomberg.com/news/articles/2017-08-28/amazon-cuts-prices-at-whole-foods-as-much-as-50-on-first-day',
      'news'
    )
  );

  store.dispatch(
    addArticle(
      'http://abcnews.go.com/US/wireStory/woman-chose-baby-chemotherapy-died-49723010',
      'news'
    )
  );

  store.dispatch(
    addArticle(
      'https://www.theguardian.com/society/2017/aug/24/woman-jailed-10-years-false-rape-claims-jemma-beale',
      'news'
    )
  );

  store.dispatch(
    addArticle(
      'https://www.washingtonpost.com/news/morning-mix/wp/2017/09/08/after-utah-nurses-violent-arrest-local-prosecutors-ask-fbi-to-help-investigate-police/?utm_term=.a7de4786e701',
      'news'
    )
  );

  store.dispatch(
    addArticle(
      'https://www.washingtonpost.com/news/post-nation/wp/2017/09/05/teen-girl-files-claim-against-police-who-mistook-her-for-a-black-male-suspect-and-punched-her/?utm_term=.6497346f0a84',
      'news'
    )
  );

  store.dispatch(
    addArticle(
      'https://www.washingtonpost.com/news/business/wp/2017/08/22/not-one-drop-of-poland-spring-bottled-water-is-from-a-spring-lawsuit-claims/',
      'news'
    )
  );

  store.dispatch(
    addArticle(
      'https://www.bloomberg.com/news/articles/2017-09-05/fema-is-almost-out-of-money-as-hurricane-irma-threatens-florida',
      'news'
    )
  );

  store.dispatch(
    addArticle(
      'http://www.msn.com/en-us/news/us/mattis-orders-pentagon-to-allow-transgender-troops-to-continue-serving-pending-study/ar-AAqX5NJ?ocid=spartanntp',
      'news'
    )
  );

  store.dispatch(
    addArticle(
      'https://gamereactor.eu/news/585493/Microsoft+confirm+theyre+in+talks+with+Sony+about+crossplay/',
      'games'
    )
  );

  store.dispatch(
    addArticle(
      'http://www.dsogaming.com/news/despite-square-enixs-promises-and-after-almost-six-months-nier-automata-has-not-received-any-patch-on-the-pc/',
      'games'
    )
  );

  store.dispatch(
    addArticle(
      'https://www.pcgamesn.com/half-life/dota-2-killed-half-life-3',
      'games'
    )
  );

  store.dispatch(
    addArticle(
      'https://www.polygon.com/2017/8/21/16177270/htc-vive-price-cut-599?utm_campaign=polygon&utm_content=chorus&utm_medium=social&utm_source=twitter',
      'games'
    )
  );

  store.dispatch(
    addArticle('https://www.youtube.com/watch?v=NWagBjDMwTU', 'games')
  );

  store.dispatch(addArticleList('0'));
  store.dispatch(addArticleList('1'));
  store.dispatch(setVisibilityFilter('All', '0'));
  store.dispatch(setSortFilter('title', '1'));
  store.dispatch(setProjectFilter('news', '1'));
  store.dispatch(resizeArticleList('0', -200, 100));
  store.dispatch(
    repositionArticleList('1', innerWidth * 0.4, innerHeight * 0.1)
  );
}
