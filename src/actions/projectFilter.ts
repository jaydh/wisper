import * as constants from '../constants/actionTypes';

export interface SetProjectFilter {
    type: constants.SET_PROJECT_FILTER;
    filter: string;
}
export function setProjectFilter(filter: string) {
    return {
        type: constants.SET_PROJECT_FILTER,
        filter
    };
}