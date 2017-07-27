import * as constants from '../constants/actionTypes';

export interface SetVisbilityFilter {
    type: constants.SET_VISIBILITY_FILTER;
    filter: string;
}
export function setVisibilityFilter(filter: string) {
    return {
        type: constants.SET_VISIBILITY_FILTER,
        filter
    };
}