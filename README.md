# Turing.js
Turing.js is an Event-Driven-Language-Design-API based on the definition of a  [turing machine](https://en.wikipedia.org/wiki/Turing_machine).

> A Turing machine is an abstract machine that manipulates symbols on a strip of tape according to a table of rules.
> The machine operates on an infinite memory tape divided into discrete cells. The machine positions its head over a cell and "reads"  the symbol there. Then, as per the symbol and its present place in a finite table of user-specified instructions, the machine (i) writes a symbol (e.g. a digit or a letter from a finite alphabet) in the cell, then (ii) either moves the tape one cell left or right, then (iii) (as determined by the observed symbol and the machine's place in the table) either proceeds to a subsequent instruction or halts the computation.

## Goal API

```ts
/* Super small counter demo */
import { Language } from 'turingjs';

new Language<{ sum: number }>()
  .token('+', state => state.data.sum++)
  .token('-', state => state.data.sum--)
  .data({ sum: 0 })
  .run('+++-++-') // Returns a promise 
  .then(finalState => console.log(finalState))
  .catch(error => console.log(error));
```

```ts
/* Types */
type Partial<T> = {
    [P in keyof T]?: T[P];
};
interface ILanguage<IData> {
  /* constructor takes an optional options object of type IOptions */
  token: (pattern: string, handler: TokenHandler<IData> ) => ILanguage<IData>;
  tokens: (tokens: { [pattern: string]: TokenHandler<IData> }) => ILanguage<IData>;
  data: (data: Partial<IData>) => ILanguage<IData>;
  run: (code: string) => Promise<IState<IData>>;
  runSynchronous: (code: string, 
    onSuccess: (finalState: IState<IData>) => void, 
    onError: (error: Error) => void
    ) => void; 
  eof: ((state: IState<IData>) => (boolean | IError) /* false => throws UnexpectedEOFError */);
}
type TokenHandler<IData> = 
(state: IState<IData>, token: IToken) => (void 
  | IError 
  | ((state: IState<IData>, token: IToken) => (boolean | IError)));
interface IOptions {
  tokenDeliminators?: {name: string, deliminator: string}[], // Default is [{name: 'empty', deliminator: ''}]
}
interface IState<IData> {
  stack: number[], // The stack will automaticaly grow into the possitive indecies
  index: number,
  data: IData, // Reserved for user defined data
}
interface IToken {
  position: number,
  value: string,
  previousDeliminator: string, // The name of the deliminator that separated this token from the previous one
  nextDeliminator: string, // The name of the deliminator that separates this token from the next one
}
enum ErrorLevel {
  MINOR = 0, // Ex: Missing token definition
  MAJOR = 1, // Ex: Unexpected EOF
  FATAL = 2, // Ex: state.index < 0
}
interface IError {
  code: number, // Status codes
  message: string,
  level: ErrorLevel,
}
```

<details>
<summary>Brainfuck demo</summary>

```ts
/* Demo */
import { Language } from 'turingjs';

interface MyData {
  in: string[],
  out: string[],
  loops: number[],
}
let myLanguage = new Language<MyData>()
  .tokens({
    '+': (state, token) => state.stack[state.index]++,
    '-': (state, token) => state.stack[state.index]--,
    '>': (state, token) => state.index++,
    '<': (state, token) => state.index--,
    ',': (state, token) => state.stack[state.index] = state.data.in.shift().charCodeAt(0),
    '.': (state, token) => state.data.out.push(String.fromCharCode(state.stack[state.index])),
    '[': (state, token) => {
      if (state.stack[state.index] === 0) {
        let i = 1;
        return (state, token) => {
          // If you return a function, it will be called instead of any token function for every token untill you return true.
          if (token.value === '[') { i++; }
          if (token.value === ']') { i--; }
          return i === 0;
        };
      } else {
        state.data.loops.push(token.position)
      }
    },
    ']': (state, token) => state.position = state.data.loops.pop(),
    '*': (state, token) => {
      // * is not a wildcard
      return {
        code: 1337,
        message: 'If you return an error, it will be thrown',
        level: ErrorLevel.MINOR,
      };
    },
  }).eof(state => state.data.loops.length === 0 /* Fails if we have opned more loops than we close */);

let code = '+++[->,.+++.<]';
let programPromise = myLanguage.data({
  in: 'ABC'.split(''),
  out: [],
  loops: [],
}).run(code);

programPromise
  .then(finalState => console.log(finalState.data.out.join('')) /* ADBECF */)
  .catch(error => console.log(error));
```
</details>
