# EventFuck
EventFuck is a Brain-Fuck-Styled-Event-Driven-Language-Design-API


## Goal API

```js
import { Language, Error } from 'eventfuck';
let myLanguage = new Language({
  '+': increment,
  '-': decrement,
  '<': leftShift,
  '>': rightShift
 }, (error, state, token) => {
  console.log(error); 
  return true; /* true to end execution */
})
  .token(',', (state, token) => state.stack[state.index] = state.data.in.shift())
  .token('.', (state, token) => state.data.out.push(state.stack[state.index]))
  .token('[', (state, token) => {
    state.allowEOF = false; 
    state.data.loops.push(token.position);
  })
  .token(']', (state, token) => {
    token.position = state.data.loops.pop();
    if (state.data.loops.length === 0) {
      state.allowEOF = true;
    }
  })
  .token('*', (state, token) => {
    return new Error({
      code: 1337,
      message: 'If you return an error, it will be handled over to the errorHandler provided in the constructor'
      level: 'MINOR'
    });
  });

let finalState = myLanguage.run('+++[->,.+++.<]', {
  // The data object is used to store data that eventfuck won't touch
  in: 'ABC'.split(''),
  out: [],
  loops: [],
});

console.log(finalState.data.out.join('')); // ADBECF

```


__Prototypes used in the Language constructor:__
```js
statePrototype = {
  stack: [0], // The stack will automaticaly grow into the possitive indecies
  index: 0,
  allowEOF: true, // Will throw an error in this is false and EOF is reached
  data: {}, // Reserved for user defined data
}
tokenPrototype: {
  position: 0,
  value: ''
}
errorPrototype = {
  code: 0, // Status codes
  message: 'OK',
  level: '', // MINOR (ex: missing token definition), MAJOR (ex: unexpected EOF) , FATAL (ex: state.index < 0)
}
```
