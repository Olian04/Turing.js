export type Partial<T> = {
    [P in keyof T]?: T[P];
};

export type ReturnState<T> = IState<Partial<T>>;
export type EOFHandler<T> =  (state: ReturnState<T>) => (boolean | IError);
export type TokenHandler<T> = 
(state: ReturnState<T>, token?: IToken) => (void 
  | IError 
  | ((state: ReturnState<T>, token?: IToken) => (boolean | IError))
);
export type TokenHandlers<T> = { [pattern: string]: TokenHandler<T> };

export interface IDeliminator {
  name: string;
  deliminator: string;
}
export interface IOptions {
  tokenDeliminators?: IDeliminator[], // Default is [{name: 'empty', deliminator: ''}]
  tokenCaseSensitive?: boolean, // true
}
export interface IState<T> {
  tokenPointer: number, // The token pointer works much like an instruction pointer in assembly, it points to the token thats being executed.
  stack: number[], // The stack will automaticaly grow into the possitive indecies
  index: number, // The index that determins where on the stack the program should read or write from.
  data: T, // Reserved for user defined data
}
export interface IToken {
  position: number,
  value: string,
  previousDeliminator: string, // The name of the deliminator that separated this token from the previous one
  nextDeliminator: string, // The name of the deliminator that separates this token from the next one
}
export enum ErrorLevel {
  MINOR = 0, // Ex: Missing token definition
  MAJOR = 1, // Ex: Unexpected EOF
  FATAL = 2, // Ex: state.index < 0
}
export interface IError {
  code: number, // Status codes
  message: string,
  level: ErrorLevel,
}
