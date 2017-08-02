import createReducer from './createReducer';
import { SetVisbilityFilter } from '../actions/visibilityFilter';

function setVisibilityFilter(visibilityState: string, action: SetVisbilityFilter) {
    return action.filter;
}

const visibilityReducer = createReducer('ACTIVE', {
    'SET_VISIBILITY_FILTER': setVisibilityFilter
});

export default visibilityReducer;