import { auth, database } from '../../firebase';
import { Dispatch } from 'react-redux';
import { fromJS, OrderedSet } from 'immutable';

export interface ArticleViewedRequested {
  type: 'ARTICLE_VIEWED_REQUESTED';
}

export interface ArticleViewedRejected {
  type: 'ARTICLE_VIEWED_REJECTED';
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

export default function articleViewed(id: string) {
  const user = auth().currentUser.uid;
  return (dispatch: Dispatch<any>) => {
    dispatch(ArticleViewedRequested());

    const dailyRef = database.ref(
      '/userData/' + user + '/articles/' + id + '/viewedOn'
    );

    dailyRef.once('value').then(function(snapshot: any) {
      const now = new Date();
      const update: OrderedSet<Date> = snapshot.val()
        ? fromJS(snapshot.val())
            .toOrderedSet()
            .map((t: string) => new Date(t))
            .sort()
            .add(now)
        : OrderedSet([now]);
      dailyRef
        .set(update.map((t: Date) => t.toLocaleString()).toJS())
        .catch((error: string) => {
          console.log(error);
          dispatch(ArticleViewedRejected());
        });
    });
  };
}
