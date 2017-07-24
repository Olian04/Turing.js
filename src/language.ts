import { IOptions, IToken, IError, TokenHandler, TokenHandlers, ReturnState, EOFHandler, ErrorLevel, Partial } from './interfaces';
import { Execution } from './execution';

export class Language<T> {
    private exec: Execution<T>;
    constructor(options?: IOptions) {
      this.exec = new Execution(options);
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

    run(program: string): Promise<ReturnState<T>> {
      return new Promise<ReturnState<T>>((resolve, reject) => {
        let executor: Execution<T> =  Object.create(this.exec);
        executor.state = this.exec.getNewState();
        resolve(executor.run(program));
      });
    }

    runSynchronous(program: string, onSuccess: (finalState: ReturnState<T>) => void,  onError: (error: Error) => void) {
      try {
        let executor: Execution<T> =  Object.create(this.exec);
        executor.state = this.exec.getNewState();
        onSuccess(executor.run(program));
      } catch (e) {
        onError(e);
      }
    }
}