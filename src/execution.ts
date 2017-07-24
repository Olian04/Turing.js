import * as _ from 'lodash';

import { IToken, TokenHandler, SkipHandler, TokenHandlers, IState, EOFHandler } from './interfaces';
import { UnexpectedEOFException, Exception } from './exceptions';

export class Execution<T> {
    state: IState<T>;
    tokenHandlers: TokenHandlers<T> = {};
    eofHandler: EOFHandler<T> = () => true;
    skipHandler: SkipHandler<T> = null;

    constructor() {
        this.tokenHandlers = {};
        this.eofHandler = () => true;
        this.state = {
            tokenPointer: 0,
            data: {},
            index: 0,
            stack: [0]
        };
    }

    getNewState(): IState<T> {
        let s: IState<T> = {
            tokenPointer: 0,
            data: _.cloneDeep(this.state.data),
            index: 0,
            stack: [0]
        };
        return s;
    }

    private delegateToken(token: IToken) {
        if (!(token.value in this.tokenHandlers)) {
            throw new Exception('UnknownTokenException', token.value);
        }
        let handlerResp = this.tokenHandlers[token.value](this.state, token);
        if (typeof handlerResp !== 'undefined') {
            this.skipHandler = handlerResp;
        }
    }

    private delegateSkip(token: IToken) {
         if (this.skipHandler !== null) {
            let skipResp = this.skipHandler(this.state, token);
            if (skipResp) {
                this.skipHandler = null;
            }
        }
    }

    private step(token: IToken) {
        if (this.skipHandler !== null) {
            this.delegateSkip(token);
        } else {
            this.delegateToken(token);
        }

        this.state.tokenPointer++; // Move the token pointer to the next token

        if (this.state.index >= this.state.stack.length) {
            this.state.stack.push(0); // Add space to the right on the "tape" if the index exceeds the current length
        }
    }

    run(code: string): IState<T> {
        let tokens = tokenize(code);

        while (this.state.tokenPointer < tokens.length) {
            if (this.state.tokenPointer < 0) {
                throw new Exception('IllegalTokenPointerException', 'tokenPointer < 0');
            }
            this.step(tokens[this.state.tokenPointer]); // One step 
        }

        let eofResp = this.eofHandler(this.state);
        if (!eofResp) {
            throw new UnexpectedEOFException();
        }

        return this.state;
    }
}

export function tokenize(code: string): IToken[] {
    let tok = code.split('');
    return tok.map((e, i) => {
        let t: IToken = {
            position: i,
            value: e
        };
        return t;
    });
}