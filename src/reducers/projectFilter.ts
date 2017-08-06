import createReducer from './createReducer';
import { SetProjectFilter } from '../actions/projectFilter';
import { List } from 'immutable';

interface ProjectFilter {
    projectFilter: string;
    id: number;
}

function setProjectFilter(projectState: List<String>, action: SetProjectFilter) {
    const newFilter: ProjectFilter = {
        projectFilter: action.filter,
        id: action.id
    };
    return projectState.set(newFilter.id, newFilter.projectFilter);
}

const visibilityReducer = createReducer(List(['ALL']), {
    'SET_PROJECT_FILTER': setProjectFilter
});

export default visibilityReducer;