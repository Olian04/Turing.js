export { Language } from './language';
export { LanguageEvent as EventType } from './interfaces';
export { GetTagFunction } from './factories/tagFunctionFactory';

import { SkipFactory } from './factories/skipHandlerFactory';
export const Skip = new SkipFactory();
