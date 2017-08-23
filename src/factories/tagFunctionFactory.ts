import { Language } from '../language';

export type ExecutionTag<T> = (strings: TemplateStringsArray) => T; // This is the default spec for a tag function (defined by mozilla)

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
 * let result = count`++-++`;
 * 
 * console.log(result.sum);
 * 
 * 
 * @export
 * @template T 
 * @param {Language<T>} language 
 * @returns {ExecutionTag<Partial<T>>} 
 */
export function GetTagFunction<T>(language: Language<T>): ExecutionTag<Partial<T>> {
    return ([code]) => {
        let result: Partial<T>;
        language.run(code, state => result = state.data);
        return result;
    };
}
