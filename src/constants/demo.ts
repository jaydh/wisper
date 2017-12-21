let Hashes = require('jshashes');
let SHA1 = new Hashes.SHA1();
import addArticle from '../actions/articles/addArticle';
import { toggleArticleRead } from '../actions/articles/toggleArticleRead';
import {
  addArticleList,
  repositionArticleList,
  resizeArticleList
} from '../actions/articleList';
import setSortFilter from '../actions/setSortFilter';
import { setProjectFilter } from '../actions/projectFilter';
import { setVisibilityFilter } from '../actions/visibilityFilter';
import addDaily from '../actions/dailies/addDaily';
import { demoStart, demoComplete } from '../actions/demo';
import demoDailyCompletion from '../actions/demo/demoDailyCompletion';
import SetUIView from '../actions/setUIView';
import { List } from 'immutable';

export default async function (store: any, persistor: any) {
  store.dispatch({ type: 'USER_LOGOUT' });
  store.dispatch(demoStart());
  store.dispatch(SetUIView('dailies'));
  store.dispatch(addArticleList('0'));
  store.dispatch(addArticleList('1'));
  store.dispatch(setVisibilityFilter('All', '0'));
  store.dispatch(setSortFilter('title', '1'));
  store.dispatch(setProjectFilter('news', '1'));
  store.dispatch(resizeArticleList('0', -200, 100));
  store.dispatch(
    repositionArticleList('1', innerWidth * 0.4, innerHeight * 0.1)
  );
  const articles = [
    {
      link:
        'https://lbpost.com/life/pets/2000011459-pet-store-bill-passes-california-senate-38-to-0',
      project: 'news'
    },
    {
      link:
        'https://www.independent.co.uk/news/uk/home-news/billy-caldwell-cannabis-oil-boy-seizures-stopped-cured-prescription-medical-marijuana-a7933066.html',
      project: 'news'
    },
    {
      link:
        'https://www.theguardian.com/us-news/2017/aug/16/kkk-permit-denied-cross-burning-stone-mountain-georgia',
      project: 'news'
    },
    {
      link:
        'https://www.bloomberg.com/news/articles/2017-08-28/amazon-cuts-prices-at-whole-foods-as-much-as-50-on-first-day',
      project: 'news'
    },
    {
      link:
        'http://abcnews.go.com/US/wireStory/woman-chose-baby-chemotherapy-died-49723010',
      project: 'news'
    },
    {
      link:
        'https://www.theguardian.com/society/2017/aug/24/woman-jailed-10-years-false-rape-claims-jemma-beale',
      project: 'news'
    },
    {
      link:
        'https://www.washingtonpost.com/news/morning-mix/wp/2017/09/08/after-utah-nurses-violent-arrest-local-prosecutors-ask-fbi-to-help-investigate-police/?utm_term=.a7de4786e701',
      project: 'news'
    },
    {
      link:
        'https://www.washingtonpost.com/news/post-nation/wp/2017/09/05/teen-girl-files-claim-against-police-who-mistook-her-for-a-black-male-suspect-and-punched-her/?utm_term=.6497346f0a84',
      project: 'news'
    },
    {
      link:
        'https://www.washingtonpost.com/news/business/wp/2017/08/22/not-one-drop-of-poland-spring-bottled-water-is-from-a-spring-lawsuit-claims/',
      project: 'news'
    },
    {
      link:
        'https://www.bloomberg.com/news/articles/2017-09-05/fema-is-almost-out-of-money-as-hurricane-irma-threatens-florida',
      project: 'news'
    },
    {
      link:
        'http://www.msn.com/en-us/news/us/mattis-orders-pentagon-to-allow-transgender-troops-to-continue-serving-pending-study/ar-AAqX5NJ?ocid=spartanntp',
      project: 'news'
    },
    {
      link:
        'https://gamereactor.eu/news/585493/Microsoft+confirm+theyre+in+talks+with+Sony+about+crossplay/',
      project: 'games'
    },
    {
      link:
        'http://www.dsogaming.com/news/despite-square-enixs-promises-and-after-almost-six-months-nier-automata-has-not-received-any-patch-on-the-pc/',
      project: 'games'
    },
    {
      link: 'https://www.pcgamesn.com/half-life/dota-2-killed-half-life-3',
      project: 'games'
    },
    {
      link:
        'https://www.polygon.com/2017/8/21/16177270/htc-vive-price-cut-599?utm_campaign=polygon&utm_content=chorus&utm_medium=social&utm_source=twitter',
      project: 'games'
    },
    {
      link:
        'https://techcrunch.com/2017/09/19/autonomous-drivings-godfather-and-tech-investors-say-the-world-is-ready-for-flying-cars/',
      project: 'tech'
    },
    {
      link:
        'https://venturebeat.com/2017/09/24/moral-programming-will-define-the-future-of-autonomous-transportation/',
      project: 'tech'
    },
    {
      link:
        'http://gas2.org/2017/09/23/tesla-developing-proprietary-chip-autonomous-driving-use/',
      project: 'tech'
    },
    {
      link:
        'https://www.computerworld.com/article/3227826/mobile-wireless/the-latest-iphones-show-why-ai-is-the-new-electricity.html',
      project: 'tech'
    },
    {
      link:
        'http://fortune.com/2017/09/24/futurist-ray-kurzweil-job-automation-loss/',
      project: 'tech'
    },
    {
      link:
        'http://www.sciencemag.org/news/2016/06/undead-genes-come-alive-days-after-life-ends',
      project: 'science'
    },
    {
      link:
        'http://www.sciencemag.org/news/2016/04/some-fairy-tales-may-be-6000-years-old',
      project: 'science'
    },
    {
      link:
        'http://www.sciencemag.org/news/2016/08/greenland-shark-may-live-400-years-smashing-longevity-record',
      project: 'science'
    },
    {
      link:
        'http://www.sciencemag.org/news/2016/06/plants-can-gamble-according-study',
      project: 'science'
    },
    {
      link:
        'http://www.sciencemag.org/news/2016/10/alien-life-could-feed-cosmic-rays',
      project: 'science'
    },
    {
      link:
        'http://www.sciencemag.org/news/2016/01/you-could-probably-have-outrun-t-rex',
      project: 'science'
    },
    {
      link:
        'http://www.sciencemag.org/news/2016/08/mysterious-ice-buried-cold-war-military-base-may-be-unearthed-climate-change',
      project: 'science'
    },
    {
      link:
        'http://www.sciencemag.org/news/2016/02/why-do-our-cells-power-plants-have-their-own-dna',
      project: 'science'
    }
  ];

  Promise.all(
    articles.map(async (t: { link: string; project?: string }) => {
      await store.dispatch(addArticle(t.link, t.project));
      if (Math.floor(Math.random() * 2) === 0) {
        store.dispatch(toggleArticleRead(SHA1.hex(t.link)));
      }
    })
  );
  const dailies = List([
    'Excercise',
    'Check the garbage',
    'Water plants',
    'Read',
    'Go for a walk',
    'Practice piano',
    'Read the news'
  ]);
  const ids = dailies.map((t: string) => SHA1.hex(t)).toList();
  await Promise.all(
    dailies
      .map(async (t: string) => await store.dispatch(addDaily(t)))
      .toArray()
  );
  await store.dispatch(demoDailyCompletion(ids));
  store.dispatch(SetUIView('dailies'));
  store.dispatch(demoComplete());
}
