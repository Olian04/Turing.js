export declare class Exception extends Error {
    constructor(name: string, msg?: string);
}
export declare class UnexpectedEOFException extends Exception {
    constructor(msg?: string);
}
export declare class NotImplementedException extends Exception {
    constructor(msg?: string);
}

import { IToken, SkipHandler, TokenHandlers, IState, EOFHandler } from './interfaces';
export declare class Execution<T> {
    state: IState<T>;
    tokenHandlers: TokenHandlers<T>;
    eofHandler: EOFHandler<T>;
    skipHandler: SkipHandler<T>;
    constructor();
    getNewState(): IState<T>;
    private delegateToken(token);
    private delegateSkip(token);
    private step(token);
    run(code: string): IState<T>;
}
export declare function tokenize(code: string): IToken[];

export declare type Partial<T> = {
    [P in keyof T]?: T[P];
};
export declare type EOFHandler<T> = (state: IState<T>) => boolean;
export declare type TokenHandler<T> = (state: IState<T>, token?: IToken) => (void | SkipHandler<T>);
export declare type SkipHandler<T> = (state: IState<T>, token?: IToken) => boolean;
export declare type TokenHandlers<T> = {
    [pattern: string]: TokenHandler<T>;
};
export interface IState<T> {
    tokenPointer: number;
    stack: number[];
    index: number;
    data: Partial<T>;
}
export interface IToken {
    position: number;
    value: string;
}

import { TokenHandler, TokenHandlers, IState, EOFHandler } from './interfaces';
export declare class Language<T> {
    private exec;
    constructor();
    token(token: string, handler: TokenHandler<T>): Language<T>;
    tokens(tokens: TokenHandlers<T>): Language<T>;
    data(data: Partial<T>): Language<T>;
    eof(handler: EOFHandler<T>): Language<T>;
    run(program: string): Promise<IState<T>>;
    runSynchronous(program: string, onSuccess: (finalState: IState<T>) => void, onError: (error: Error) => void): void;
}

import { Language as _Language } from './language';
export declare class Language<T> extends _Language<T> {
}
