# EventFuck
EventFuck is a Brain-Fuck-Styled-Event-Driven-Language-Design-API


## Goal API

```ts
/* Super small counter demo */
import { Language } from 'eventfuck';

new Language<{ sum: number }>()
  .token('+', state => state.data.sum++)
  .token('-', state => state.data.sum--)
  .data({ sum: 0 })
  .run('+++-++-')
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
}
interface IState<IData> {
  stack: number[], // The stack will automaticaly grow into the possitive indecies
  index: number,
  allowEOF: boolean, // Will throw an error in this is false and EOF is reached
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
  })
  .token('[', (state, token) => {
    state.allowEOF = false; 
    state.data.loops.push(token.position);
  })
  .token(']', (state, token) => {
    token.position = state.data.loops.pop();
    if (state.data.loops.length === 0) {
      state.allowEOF = true;
    }
  });

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
