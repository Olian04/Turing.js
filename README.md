[![CircleCI](https://circleci.com/gh/Olian04/Turing.js/tree/master.svg?style=shield&circle-token=b901a939d226b2f1a28e5d2823983da26854ea98)](https://circleci.com/gh/Olian04/Turing.js/tree/master)
![Npm dependancies](https://david-dm.org/olian04/turing.js.svg)

# [Turing.js](https://olian04.github.io/Turing.js/)
Turing.js is an Event-Driven-Language-Design-API based on the definition of a  [turing machine](https://en.wikipedia.org/wiki/Turing_machine).

> A Turing machine is an abstract machine that manipulates symbols on a strip of tape according to a table of rules.
> The machine operates on an infinite memory tape divided into discrete cells. The machine positions its head over a cell and "reads"  the symbol there. Then, as per the symbol and its present place in a finite table of user-specified instructions, the machine (i) writes a symbol (e.g. a digit or a letter from a finite alphabet) in the cell, then (ii) either moves the tape one cell left or right, then (iii) (as determined by the observed symbol and the machine's place in the table) either proceeds to a subsequent instruction or halts the computation.

## Install

__CDN:__ https://cdn.rawgit.com/Olian04/Turing.js/master/bin/turingjs.js <br>
__npm:__ TBD

## API

<details open>
<summary><b>ES5</b></summary>

```js
/* Super small counter demo */
let Language = require('turingjs').Language;

new Language()
    .token('+', state => { state.data.sum++ })
    .token('-', state => { state.data.sum-- })
    .data({ sum: 0 })
    .run('+--++-++++')
    .then(state => console.log(state.data.sum)/* 4 */)
    .catch(err => { throw err });
```

<details>
<summary>Brainfuck demo</summary>

```js
/* The full Brainfuck language */
let Language = require('turingjs').Language;

let brainfuck = new Language()
    .token({
        '+': state => { state.stack[state.index]++ },
        '-': state => { state.stack[state.index]-- },
        '>': state => { state.index++ },
        '<': state => { state.index-- },
        ',': state => { state.stack[state.index] = state.data.in.shift().charCodeAt(0) },
        '.': state => { state.data.out.push(String.fromCharCode(state.stack[state.index])) },
        '[': (state, token) => {
            state.data.loops.push(token.position)
            if (state.stack[state.index] === 0) {
                return (state, token) => {
                    if (token.value === '[') { state.data.loops.push(NaN) }
                    if (token.value === ']') { state.data.loops.pop() }
                    return state.data.loops.length === 0;
                };
            }
        },
        ']': (state, token) => { 
            state.tokenPointer = state.data.loops.pop() - 1; 
            // -1 in order to offset the auto increment done by turingjs
        },
    })
    .on('eof', state => {
        return state.data.loops.length === 0;
    })
    .data({ in: [], out: [], loops: [] });

brainfuck
    .data({ in: 'ABC'.split('') })
    .run('+++[->,.+++.<]')
    .then(finalState => console.log(finalState.data.out.join(''))/* ADBECF */)
    .catch(error => console.log(error));
```
</details>
<hr>
</details>


<details open>
<summary><b>Typescript</b></summary>

```ts
/* Super small counter demo */
import { Language } from 'turingjs';

new Language<{ sum: number }>()
    .token('+', state => { state.data.sum++ })
    .token('-', state => { state.data.sum-- })
    .data({ sum: 0 })
    .run('+--++-++++')
    .then(state => console.log(state.data.sum)/* 4 */)
    .catch(err => { throw err });
```

<details>
<summary>Brainfuck demo</summary>

```ts
/* The full Brainfuck language */
import { Language } from 'turingjs';

interface BFData {
  in: string[],
  out: string[],
  loops: number[]
}
let brainfuck = new Language<BFData>()
    .token({
        '+': state => { state.stack[state.index]++ },
        '-': state => { state.stack[state.index]-- },
        '>': state => { state.index++ },
        '<': state => { state.index-- },
        ',': state => { state.stack[state.index] = state.data.in.shift().charCodeAt(0) },
        '.': state => { state.data.out.push(String.fromCharCode(state.stack[state.index])) },
        '[': (state, token) => {
            state.data.loops.push(token.position)
            if (state.stack[state.index] === 0) {
                return (state, token) => {
                    if (token.value === '[') { state.data.loops.push(NaN) }
                    if (token.value === ']') { state.data.loops.pop() }
                    return state.data.loops.length === 0;
                };
            }
        },
        ']': (state, token) => { 
            state.tokenPointer = state.data.loops.pop() - 1; 
            // -1 in order to offset the auto increment done by turingjs
        },
    })
    .on('eof', state => {
        return state.data.loops.length === 0;
    })
    .data({ in: [], out: [], loops: [] });

brainfuck
    .data({ in: 'ABC'.split('') })
    .run('+++[->,.+++.<]')
    .then(finalState => console.log(finalState.data.out.join(''))/* ADBECF */)
    .catch(error => console.log(error));
```
</details>
<hr>
</details>

## Update log

#### 1.0
All MVP features have been implemented.
A usable demo consisting of all Brainf**k instruction can be run.

#### 0.1
All basic components have been had their development started.
A usable demo consisting of all Brainf**k instruction, except the loops, can be run.


## TODO
* Write more tests
