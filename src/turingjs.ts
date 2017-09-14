export { Language } from './language';
export { GetTagFunction } from './factories/tagFunctionFactory';

import { SkipFactory } from './factories/skipHandlerFactory';
export const Skip = new SkipFactory();
