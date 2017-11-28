import { SetUIView } from '../actions/setUIView';
import createReducer from './createReducer';

interface UIState {
  view: string;
}

function setUIView(uiState: UIState, action: SetUIView): UIState {
  return { ...uiState, view: action.view };
}

export default createReducer(
  { view: 'Full' },
  {
    SET_UI_VIEW: setUIView
  }
);
