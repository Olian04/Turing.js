# Turing.js
Turing.js is an Event-Driven-Language-Design-API based on the definition of a  [turing machine](https://en.wikipedia.org/wiki/Turing_machine).

> A Turing machine is an abstract machine that manipulates symbols on a strip of tape according to a table of rules.
> The machine operates on an infinite memory tape divided into discrete cells. The machine positions its head over a cell and "reads"  the symbol there. Then, as per the symbol and its present place in a finite table of user-specified instructions, the machine (i) writes a symbol (e.g. a digit or a letter from a finite alphabet) in the cell, then (ii) either moves the tape one cell left or right, then (iii) (as determined by the observed symbol and the machine's place in the table) either proceeds to a subsequent instruction or halts the computation.

## Goal API

```ts
/* Super small counter demo */
import { Language } from 'eventfuck';

new Language<{ sum: number }>()
  .token('+', state => state.data.sum++)
  .token('-', state => state.data.sum--)
  .data({ sum: 0 })
  .run('+++-++-') // Returns a promis 
  .then(finalState => console.log(finalState))
  .catch(error => console.log(error));
```

```ts
/* Types */
type TokenHandler<IData> = (state: IState<IData>, token: IToken) => (IError | void);
interface ILanguage<IData> {
  token: (token: string, TokenHandler<IData> ) => ILanguage,
  tokens: ({ [token: string]: TokenHandler<IData> }) => ILanguage,
  data: ( IData ) => ILanguage,
  run: ( code: string ) => Promise<IState>,
  eof: ( (state: IState<IData>) => (boolean | IError) /* false => throws UnexpectedEOFError */)
}
interface IState<IData> {
  stack: number[], // The stack will automaticaly grow into the possitive indecies
  index: number,
  data: IData, // Reserved for user defined data
}
interface IToken {
  position: number,
  value: string,
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
import { Language } from 'eventfuck';
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
    '[': (state, token) => state.data.loops.push(token.position),
    ']': (state, token) => state.position = state.data.loops.pop(),
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
