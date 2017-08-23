import * as _ from 'lodash';

import { IToken, TokenHandler, SkipHandler, TokenHandlers, IState, EventHandler, LanguageEvent, EventHandlers } from './interfaces';
import { Exception, EventRefusedException, UnexpectedEOFException } from './exceptions';

export class ExecutionState<T> {
    state: IState<T>;
    eventHandlers: EventHandlers<T> = {};
    tokenHandlers: TokenHandlers<T> = {};
    skipHandler: SkipHandler<T> = null;

    constructor() {
        this.state = {
            tokenPointer: 0,
            data: {},
            index: 0,
            stack: [0]
        };
    }

    clone(): ExecutionState<T> {
        let stateClone = new ExecutionState<T>();
        stateClone = _.cloneDeep(this);
        return stateClone;
    }
}

export function handleEvent<T>(executionState: ExecutionState<T>, token: IToken, event: LanguageEvent, exceptionIfFail: Exception) {
    if ( (event in executionState.eventHandlers) && !(executionState.eventHandlers[event.toString()](executionState.state, token)) ) {
        // If the event returns false
        throw exceptionIfFail;
    }
}

export function delegateToken<T>(executionState: ExecutionState<T>, token: IToken) {
    if (!(token.value in executionState.tokenHandlers)) {
        handleEvent(executionState, token,
            LanguageEvent.unexpectedToken, 
            new Exception('UnknownTokenException', token.value)
        );
    } else {
        let handlerResp = executionState.tokenHandlers[token.value](executionState.state, token);
        if (typeof handlerResp !== 'undefined') {
            // A skip handler got returned by a token handler
            executionState.skipHandler = handlerResp;
        }
    }
}

export function delegateSkip<T>(executionState: ExecutionState<T>, token: IToken) {
    if (executionState.skipHandler !== null) {
        let noMoreSkip = executionState.skipHandler(executionState.state, token);
        if (noMoreSkip) {
            executionState.skipHandler = null;
        }
    }
}

export function incrementTokenCounter<T>(executionState: ExecutionState<T>) {
    executionState.state.tokenPointer++; // Move the token pointer to the next token
}

export function updateStateSize<T>(executionState: ExecutionState<T>) {
    if (executionState.state.index >= executionState.state.stack.length) {
        executionState.state.stack.push(0); // Add space to the right on the "tape" if the index exceeds the current length
    }
}

export function executeToken<T>(executionState: ExecutionState<T>, token: IToken) {
    if (executionState.skipHandler !== null) {
        delegateSkip(executionState, token);
    } else {
        delegateToken(executionState, token);
    }

    incrementTokenCounter(executionState);
}

export function executeTokens<T>(executionState: ExecutionState<T>, tokens: IToken[]) {

    while (executionState.state.tokenPointer < tokens.length) {
        if (executionState.state.tokenPointer < 0) {
            throw new Exception('IllegalTokenPointerException', 'tokenPointer < 0');
        }
        executeToken(executionState, tokens[executionState.state.tokenPointer]);
    }

    // Handle eof event
    handleEvent(executionState, null,
        LanguageEvent.eof, 
        new UnexpectedEOFException()
    );
}

export function tokenizeString(code: string): IToken[] {
    let tok = code.split('');
    return tok.map((e, i) => {
        let t: IToken = {
            position: i,
            value: e
        };
        return t;
    });
}