export interface SetUIView {
  type: 'SET_UI_VIEW';
  view: string;
}

export default function setUIView(view: string): SetUIView {
  return {
    type: 'SET_UI_VIEW',
    view
  };
}