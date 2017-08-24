import { Exception } from './exceptions';

export enum LanguageEvent {
    eof = 'eof',
    unexpectedToken = 'unexpectedToken',
};
export type EventHandlers<T> = { event?: EventHandler<T> };
export type EventHandler<T> = (state: IState<T>, token?: IToken) => boolean;

export type TokenHandlers<T> = { [pattern: string]: TokenHandler<T> };
export type TokenHandler<T> = (state: IState<T>, token?: IToken) => ( 
    void 
    | SkipHandler<T>
);
export type SkipHandler<T> = (state: IState<T>, token?: IToken) => boolean;

export interface IState<T> {
    tokenPointer: number, // The token pointer works much like an instruction pointer in assembly, it points to the token thats being executed.
    stack: number[], // The stack will automaticaly grow into the possitive indecies
    index: number, // The index that determins where on the stack the program should read or write from.
    data: Partial<T>, // Reserved for user defined data
};
export interface IToken {
    position: number,
    value: string
};
