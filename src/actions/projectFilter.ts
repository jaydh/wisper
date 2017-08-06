import * as constants from '../constants/actionTypes';

export interface SetProjectFilter {
    type: constants.SET_PROJECT_FILTER;
    filter: string;
    id: number;
}
export function setProjectFilter(filter: string, id: number) {
    return {
        type: constants.SET_PROJECT_FILTER,
        filter,
        id
    };
}