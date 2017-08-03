import { Map, List, Iterable } from 'immutable';

declare module 'immutable' {
  export interface List<T> {
    filter(
      predicate: (value: T) => boolean,
      context?: any
    ): /*this*/ Iterable<number, T>;
    filterNot(
      predicate: (value: T) => boolean,
      context?: any
    ): /*this*/ Iterable<number, T>;
    map(
      predicate: (value: T) => any,
      context?: any
    ): /*this*/ Iterable<number, T>;
  }
}
