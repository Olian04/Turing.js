import { IOptions, IToken, IError, IDeliminator, TokenHandler, TokenHandlers, ReturnState, EOFHandler, ErrorLevel, Partial } from './interfaces';
import * as _ from 'lodash';

export class Execution<T> {
    state: ReturnState<T>;
    tokenHandlers: TokenHandlers<T> = {};
    eofHandler: EOFHandler<T> = () => true;
    options: IOptions;

    constructor(options?: IOptions) {
        this.options = options || {
            /* Default options */ 
            tokenCaseSensitive: true,
            tokenDeliminators: [{
                deliminator: '',
                name: 'Empty'
            }]
        };
        this.tokenHandlers = {};
        this.eofHandler = () => true;
        this.state = {
            tokenPointer: 0,
            data: {},
            index: 0,
            stack: [0]
        };
    }

    getNewState(): ReturnState<T> {
        let s: ReturnState<T> = {
            tokenPointer: 0,
            data: _.cloneDeep(this.state.data),
            index: 0,
            stack: [0]
        };
        return s;
    }

    private delegateToken(token: IToken) {
        this.tokenHandlers[token.value](this.state, token);

        if (this.state.index >= this.state.stack.length) {
            this.state.stack.push(0); // Add space to the right on the "tape" in the index excedes the current length
        }

        return true; // Should execution continue?
    }

    run(code: string): ReturnState<T> {
        let tokens = new Tokenizer(Object.keys(this.tokenHandlers), this.options.tokenDeliminators).run(code);

        while (this.state.tokenPointer < tokens.length) {
            this.delegateToken(tokens[this.state.tokenPointer]);
            this.state.tokenPointer++;
        }
        let isOkEof = this.eofHandler(this.state);

        return this.state;
    }
}

class Tokenizer {
    tokens: string[];
    deliminators: IDeliminator[];
    constructor(tokens: string[], deliminators: IDeliminator[]) {
        this.tokens = tokens;
        this.deliminators = deliminators;
    }
    run(code: string): IToken[] {
        let tok = code.split(this.deliminators[0].deliminator);
        return tok.map((e, i) => {
            let t: IToken = {
                nextDeliminator: this.deliminators[0].deliminator,
                previousDeliminator: '',
                position: i,
                value: e
            };
            return t;
        });
        // TODO: Implement the tokenizer for real (all above is just temporary)
    }
}