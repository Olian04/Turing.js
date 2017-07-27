import { IToken, TokenHandler, TokenHandlers, IState, EOFHandler } from './interfaces';
import { ExecutionState, executeTokens, tokenizeString } from './execution';

export class Language<T> {
    private executionStateStore: ExecutionState<T>;

    constructor() {
        this.executionStateStore = new ExecutionState();
    }

    /**
     * Takes an object where every key is a token-string and every value is the handler for its key
     * 
     * @param {TokenHandlers<T>} tokens 
     * @returns {Language<T>} 
     * @memberof Language
     */
    token(tokens: TokenHandlers<T>): Language<T>; // 1

    /**
     * Takes a token-string and a function to handle occurrences of the token in code
     * 
     * @param {string} token 
     * @param {TokenHandler<T>} handler 
     * @returns {Language<T>} 
     * @memberof Language
     */
    token(token: string, handler: TokenHandler<T>): Language<T>; // 0

    /**
     * Alias for .on('unexpectedToken', handler);
     * 
     * @param {TokenHandler<T>} unexpectedTokenHandler 
     * @returns {Language<T>} 
     * @memberof Language
     */
    token(unexpectedTokenHandler: TokenHandler<T>): Language<T>; // 2
    token(...args: any[]): Language<T> {
        if (args.length === 2) {
            // 0: Accepts one token
            let [token, handler] = args;
            this.executionStateStore.tokenHandlers[token] = handler; 
        } else if (args.length === 1 && typeof args[0] === 'object') {
            // 1: Accepts an object with many tokens
            let [tokens] = args;
            this.executionStateStore.tokenHandlers = {...this.executionStateStore.tokenHandlers, ...tokens};
        } else if (args.length === 1 && typeof args[0] === 'function') {
            // 2: Alias for .on('unexpectedToken', handler);
            let [unexpectedTokenHandler] = args;
            this.on('unexpectedToken', unexpectedTokenHandler);
        }
        return this;
    }


    /**
     * Takes an object to be appended to the data object of the state
     * 
     * @param data 
     */
    data(data: Partial<T>): Language<T>; // 0

    /**
     * Takes a key-value pair to be injected into the data object of the state object
     * 
     * @template K 
     * @param {K} key 
     * @param {T[K]} value 
     * @returns {Language<T>} 
     * @memberof Language
     */
    data<K extends keyof T>(key: K, value: T[K]): Language<T>; // 1

    data(...args: any[]): Language<T> {
        if (args.length === 1) {
            // 0: Accepts one 
            let [data] = args;
            this.executionStateStore.state.data = {...this.executionStateStore.state.data as object, ...data as object};
        } else if (args.length === 2) {
            let [key, value] = args;
            this.executionStateStore.state.data[key] = value;
        }
        return this;
    }

    /**
     * Takes a handler that will fire once the end of file is reached
     * If this isn't defined the eof event will always return true
     * 
     * @param {'eof'} event 
     * @param {EOFHandler<T>} handler 
     * @returns {Language<T>} 
     * @memberof Language
     */
    on(event: 'eof', handler: EOFHandler<T>): Language<T>;

    /**
     * Takes a handler that will fire if any unrecognized tokens show up in the program
     * If this isn't defined an error will instead be thrown
     * 
     * @param {'unexpectedToken'} event 
     * @param {TokenHandler<T>} handler 
     * @returns {Language<T>} 
     * @memberof Language
     */
    on(event: 'unexpectedToken', handler: TokenHandler<T>): Language<T>;
    on(...args: any[]): Language<T> {
        let [event, ...subArgs] = args;
        if (event === 'eof') {
            let [handler] = subArgs;
            this.executionStateStore.eofHandler = handler;
        } else if (event === '') {
            let [unexpectedTokenHandler] = subArgs;
            this.executionStateStore.unexpectedTokenHandler = unexpectedTokenHandler;
        }
        return this;
    }

    /**
     * Takes a string of code and runs it asynchronously
     * 
     * @param {string} program 
     * @returns {Promise<IState<T>>} 
     * @memberof Language
     */
    run(program: string): Promise<IState<T>>; // 0

    /**
     * Takes a string of code and runs it synchronously
     * 
     * @param {string} program 
     * @param {(finalState: IState<T>) => void} onSuccess 
     * @param {(error: Error) => void} [onError] 
     * @memberof Language
     */
    run(program: string, onSuccess: (finalState: IState<T>) => void,  onError?: (error: Error) => void): void; // 1
    run(...args: any[]): any {
        if (args.length === 1) {
            // 0: Runs asynchronously
            let [program] = args;
            return new Promise<IState<T>>((resolve, reject) => {
                setTimeout(() => { 
                    /* This needs to be deffered due to a bug in vscode 
                    See: https://stackoverflow.com/questions/45282653/why-does-vs-code-break-on-handled-exception-from-reject-in-promise/
                    */
                    try {
                        resolve(execute(this.executionStateStore, program));
                    } catch (e) {
                        reject(e);
                    }
                }, 0);
            });
        } else if (args.length === 2) {
            // 1 (without onError): Runs synchronously
            let [program, onSuccess, onError] = args;
            try {
                onSuccess(execute(this.executionStateStore, program));
            } catch (e) {
                throw e;
            }
        } else if (args.length === 3) {
            // 1 (with onError): Runs synchronous
            let [program, onSuccess, onError] = args;
            try {
                onSuccess(execute(this.executionStateStore, program));
            } catch (e) {
                onError(e);
            }
        }
    }
}

function execute<T>(executionStateStore: ExecutionState<T>, program: string): IState<T> {
    let executionState = executionStateStore.clone(); // Create a deep clone of the current stateStore
    let tokens = tokenizeString(program);
    executeTokens(executionState, tokens);
    return executionState.state;
}