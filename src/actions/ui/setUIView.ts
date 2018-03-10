import { auth, database } from '../../firebase';
import { Dispatch } from 'react-redux';

export interface SetUIView {
  type: 'SET_UI_VIEW';
  view: string;
}

export function setUIViewSuccess(view: string): SetUIView {
  return {
    type: 'SET_UI_VIEW',
    view
  };
}

export default function setUIView(view: string) {
  const user = auth()!.currentUser!.uid;
  const ref = database.ref('/userData/' + user + '/uiView');

  return async (dispatch: Dispatch<any>) =>
    ref
      .set(view)
      .then(() => {
        dispatch(setUIViewSuccess(view));
        window.scrollTo(0, 0);
      })
      .catch((error: string) => {
        console.log(error);
      });
}
