import { IState, IToken, SkipHandler } from '../interfaces';

export class SkipUntilFactory {
    token<T>(token: string): SkipHandler<T> {
        return (s, t) => {
            return token === t.value;
        };
    }

    balanced(incrementToken: string, decrementToken: string, initialBalance: number) {
        let balance = initialBalance;
        return (state, token) => {
            if (token.value === incrementToken) { 
                balance += 1;
            }
            else if (token.value === decrementToken) { 
                balance -= 1;
            }
            return balance === 0;
        };
    }
}

export class SkipWhileFactory {
    token<T>(token: string): SkipHandler<T> {
        return (s, t) => {
            return token !== t.value;
        };
    }
}

export class SkipFactory {
    until = new SkipUntilFactory();
    while = new SkipWhileFactory();
}
