import { Language } from '../language';

export type TagFunction<T> = (strings: TemplateStringsArray) => T; // This is the default spec for a tag function (defined by mozilla)

/**
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
 * 
 * @export
 * @template T 
 * @param {Language<T>} language 
 * @returns {TagFunction<Partial<T>>} 
 */
export function GetTagFunction<T>(language: Language<T>): TagFunction<Partial<T>> {
    return ([code]) => {
        let result: Partial<T>;
        language.run(code, state => {
            result = state.data; // TODO: Decide, should the tag function return the state, or just the data?
        }, err => { 
            /* Since tag function syntax only accept one parameter we need to make sure the runtime explodes on error */ 
            throw err; 
        });
        return result;
    };
}
