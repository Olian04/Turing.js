# EventFuck
EventFuck is a Brain-Fuck-Styled-Event-Driven-Language-Design-API


## Goal API

__First way:__
```js
import { Language } from 'eventfuck';
let myLanguage = new Language({
  // Object where the 
  '+': increment,
  '-': decrement,
  '<': leftShift,
  '>': rightShift,
  '.': putChar,
  ',': readChar,
  '[': beginLoop,
  ']': endLoop,
}, handleError);

function handleError(error, state, token) {
  console.log(error);
  return true; // Return 'true' to end execution
}

function increment(state, token) {
  state.stack[state.index]++;
}
function decrement(state, token) {
  state.stack[state.index]--;
}
function leftShift(state, token) {
  // Throws error if the index ends upp below 0
  state.index--;
}
function rightShift(state, token) {
  state.index++;
}
function readChar(state, token) {
  state.stack[state.index] = state.data.in.shift();
} 
function putChar(state, token) {
  state.data.out.push(state.stack[state.index]);
}
function beginLoop(state, token) {
  state.data.loops.push(state.index);
}
function endLoop(state, token) {
  state.index = state.data.loops.pop();
}

let finalState = myLanguage.run('+++[->,.+++.<]', {
  // The data object is used to store data that eventfuck won't touch
  in: 'ABC'.split(''),
  out: [],
  loops: [],
});

console.log(finalState.data.out.join('')); // ADBECF
```



__Seccond way:__
```js
import { Language } from 'eventfuck';
let myLanguage = new Language({}, (error, state, token) => {
  console.log(error); 
  return true; /* true to end execution */
})
  .token('+', (state, token) => state.stack[state.index]++)
  .token('-', (state, token) => state.stack[state.index]--)
  .token('<', (state, token) => state.index--)
  .token('>', (state, token) => state.index++)
  .token(',', (state, token) => state.stack[state.index] = state.data.in.shift())
  .token('.', (state, token) => state.data.out.push(state.stack[state.index]))
  .token('[', (state, token) => state.data.loops.push(state.index))
  .token(']', (state, token) => state.index = state.data.loops.pop());

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
  data: {}, // Reserved for user defined data
}
tokenPrototype: {
  position: {
    row: 0,
    column: 0,
  },
  value: ''
}
errorPrototype = {
}
```
