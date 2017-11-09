import { auth, database } from '../../firebase';
import { Dispatch } from 'react-redux';
import { fromJS, OrderedSet } from 'immutable';
import { Moment } from 'moment';
import * as moment from 'moment';

export interface ArticleViewedRequested {
  type: 'ARTICLE_VIEWED_REQUESTED';
}

export interface ArticleViewedRejected {
  type: 'ARTICLE_VIEWED_REJECTED';
}

export interface ArticleViewedFulfilled {
  type: 'ARTICLE_VIEWED_FULFILLED';
  date: Moment;
  id: string;
}

function ArticleViewedRequested(): ArticleViewedRequested {
  return {
    type: 'ARTICLE_VIEWED_REQUESTED'
  };
}

function ArticleViewedRejected(): ArticleViewedRejected {
  return {
    type: 'ARTICLE_VIEWED_REJECTED'
  };
}

function ArticleViewedFulfilled(id: string): ArticleViewedFulfilled {
  return {
    type: 'ARTICLE_VIEWED_FULFILLED',
    date: moment(),
    id
  };
}

export function ArticleViewed(id: string) {
  const user = auth().currentUser.uid;
  return (dispatch: Dispatch<any>) => {
    dispatch(ArticleViewedRequested());

    const dailyRef = database.ref(
      '/userData/' + user + '/articles/' + id + '/viewedOn'
    );

    dailyRef.once('value').then(function(snapshot: any) {
      const now = moment();
      const update: OrderedSet<Moment> = snapshot.val()
        ? fromJS(snapshot.val())
            .toOrderedSet()
            .map((t: string) => moment(t))
            .sort()
            .add(now)
        : OrderedSet([now]);
      dailyRef
        .set(update.map((t: Moment) => t.toLocaleString()).toJS())
        .then(() => {
          dispatch(ArticleViewedFulfilled(id));
        })
        .catch((error: string) => {
          console.log(error);
          dispatch(ArticleViewedRejected());
        });
    });
  };
}
