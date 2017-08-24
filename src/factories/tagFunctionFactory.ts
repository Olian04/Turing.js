import { Language } from '../language';
import { IState } from '../interfaces';

export type TagFunction<T> = (strings: TemplateStringsArray, ...data: Partial<T>[]) => IState<T>; // This is the default spec for a tag function (defined by mozilla)

/**
 * 
 * A tag function is a function usually used in templating languages, and is used in front of a string
 * 
 * let counterLanguage = new Language<{ sum: number }>()
 *  .token('+', state => { state.data.sum++ })
 *  .token('-', state => { state.data.sum-- })
 *  .data({ sum: 0 });
 * 
 * let count = GetTagFunction(counterLanguage);
 * 
 * let result = count\`++-++\`;
 * 
 * console.log(result.sum);
 * 
 * @export
 * @template T 
 * @param {Language<T>} language 
 * @param {(error: Error) => void} [errorCallback] 
 * @returns {TagFunction<T>} 
 */
export function GetTagFunction<T>(language: Language<T>, errorCallback?: (error: Error) => void): TagFunction<T> {
    let tempLang: Language<T> = new Language(language); // Copy the original language
    return (codeFragments, ...data: Partial<T>[]) => {
        let lang: Language<T> = new Language(tempLang); // Create a local copy for each execution. Prevents overflow of data
        let code = codeFragments.reduce((res, c) => {
            return ''+res+''+c;
        }, '');
        data.forEach(e => {
            lang.data(e);
        });
        let result: IState<T>;
        lang.run(code, state => {
            result = state; 
        }, err => { 
            if (typeof errorCallback === 'function') {
                errorCallback(err);
            } else {
                /* Since the tag function syntax only accept one parameter we need to make sure the runtime explodes on error */ 
                throw err; 
            }
        });
        return result;
    };
}
