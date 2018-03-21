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
  return async (dispatch: Dispatch<any>) => {
    window.scrollTo(0, 0);
    dispatch(setUIViewSuccess(view));
  };
}
