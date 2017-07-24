import { Language as _Language } from './language';

export class Language<T> extends _Language<T> {};

if (window) {
    window['Language'] = Language;
}