import createReducer from './createReducer';
import { SetProjectFilter } from '../actions/projectFilter';

function setProjectFilter(projectState: string, action: SetProjectFilter) {
    return action.filter;
}

const visibilityReducer = createReducer('NONE', {
    'SET_PROJECT_FILTER': setProjectFilter
});

export default visibilityReducer;