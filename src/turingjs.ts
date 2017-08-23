import { Language as _Language } from './language';

import { GetTagFunction as _GetTagFunction } from './factories/tagFunctionFactory';
import { SkipFactory } from './factories/skipHandlerFactory';

export const Skip = new SkipFactory();
export const GetTagFunction = _GetTagFunction;
export class Language<T> extends _Language<T> {};

if (typeof window !== 'undefined') {
    // Setup for running in the browser
    // TODO: make sure this actually works...
    window['Language'] = Language;
}
