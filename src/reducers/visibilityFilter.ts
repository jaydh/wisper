import createReducer from './createReducer';
import { SetVisbilityFilter } from '../actions/visibilityFilter';

function setVisibilityFilter(visibilityState: string, action: SetVisbilityFilter) {
    return action.filter;
}

const visibilityReducer = createReducer('SHOW_ACTIVE', {
    'SET_VISIBILITY_FILTER': setVisibilityFilter
});

export default visibilityReducer;