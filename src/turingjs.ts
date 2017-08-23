import { Language as _Language } from './language';

export class Language<T> extends _Language<T> {};

if (typeof window !== 'undefined') {
    // Setup for running in the browser
    // TODO: make sure this actually works...
    window['Language'] = Language;
}

