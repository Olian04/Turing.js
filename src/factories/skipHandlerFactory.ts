import { IState, IToken, SkipHandler } from '../interfaces';

export class SkipUntilFactory {
    token<T>(token: string): SkipHandler<T> {
        return (s, t) => {
            return token === t.value;
        };
    }

    false<T>(callback: (state: IState<T>, token?: IToken) => boolean): SkipHandler<T> {
        return this.true((s, t) => !callback(s, t));
    }

    true<T>(callback: (state: IState<T>, token?: IToken) => boolean): SkipHandler<T> {
        // This provides a natural way of constructing skip-handlers without knowing the internal workings
        return (s, t) => {
            return callback(s, t); 
        };
    }
}

export class SkipWhileFactory {
    token<T>(token: string): SkipHandler<T> {
        return (s, t) => {
            return token !== t.value;
        };
    }

    true<T>(callback: (state: IState<T>, token?: IToken) => boolean): SkipHandler<T> {
        return this.true((s, t) => !callback(s, t));
    }

    false<T>(callback: (state: IState<T>, token?: IToken) => boolean): SkipHandler<T> {
        // This provides a natural way of constructing skip-handlers without knowing the internal workings
        return (s, t) => {
            return callback(s, t); 
        };
    }
}

export class SkipFactory {
    until = new SkipUntilFactory();
    while = new SkipWhileFactory();
}