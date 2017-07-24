import { IToken, TokenHandler, TokenHandlers, IState, EOFHandler } from './interfaces';
import { Execution } from './execution';

export class Language<T> {
    private exec: Execution<T>;
    constructor() {
        this.exec = new Execution();
    }

    token(token: string, handler: TokenHandler<T>): Language<T> {
        this.exec.tokenHandlers[token] = handler; 
        return this;
    }

    tokens(tokens: TokenHandlers<T>): Language<T> {
        this.exec.tokenHandlers = {...this.exec.tokenHandlers, ...tokens};
        return this;
    }

    data(data: Partial<T>): Language<T> {
        this.exec.state.data = {...this.exec.state.data as object, ...data as object};
        return this;
    }

    eof(handler: EOFHandler<T>): Language<T> {
        this.exec.eofHandler = handler;
        return this;
    }

    run(program: string): Promise<IState<T>> {
        return new Promise<IState<T>>((resolve, reject) => {
            setTimeout(() => { 
                /* This needs to be deffered due to a bug in vscode 
                See: https://stackoverflow.com/questions/45282653/why-does-vs-code-break-on-handled-exception-from-reject-in-promise/
                */
                try {
                    let executor: Execution<T> =  Object.create(this.exec);
                    executor.state = this.exec.getNewState();
                    resolve(executor.run(program));
                } catch (e) {
                    reject(e);
                }
            }, 0);
        });
    }

    runSynchronous(program: string, onSuccess: (finalState: IState<T>) => void,  onError: (error: Error) => void) {
        try {
            let executor: Execution<T> =  Object.create(this.exec);
            executor.state = this.exec.getNewState();
            onSuccess(executor.run(program));
        } catch (e) {
            onError(e);
        }
    }
}