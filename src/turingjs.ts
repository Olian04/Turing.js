import { Language as _Language } from './language';

export class Language<T> extends _Language<T> {};

if (typeof window !== 'undefined') {
    window['Language'] = Language;
}   
