[![CircleCI](https://circleci.com/gh/Olian04/Turing.js/tree/master.svg?style=shield&circle-token=b901a939d226b2f1a28e5d2823983da26854ea98)](https://circleci.com/gh/Olian04/Turing.js/tree/master)
![Npm dependancies](https://david-dm.org/olian04/turing.js.svg)

[![Turing.js logo](https://i.imgur.com/Y2g0yiA.png)](https://olian04.github.io/Turing.js/)

# [Turing.js](https://olian04.github.io/Turing.js/)
Turing.js is an Event-Driven-Language-Design-API based on the definition of a  [turing machine](https://en.wikipedia.org/wiki/Turing_machine).

> A Turing machine is an abstract machine that manipulates symbols on a strip of tape according to a table of rules.
> The machine operates on an infinite memory tape divided into discrete cells. The machine positions its head over a cell and "reads"  the symbol there. Then, as per the symbol and its present place in a finite table of user-specified instructions, the machine (i) writes a symbol (e.g. a digit or a letter from a finite alphabet) in the cell, then (ii) either moves the tape one cell left or right, then (iii) (as determined by the observed symbol and the machine's place in the table) either proceeds to a subsequent instruction or halts the computation.

## Install

__CDN:__ https://cdn.rawgit.com/Olian04/Turing.js/master/bin/turingjs.js <br>
__npm:__ TBD

---

__Live demo:__ [Turing.js](https://olian04.github.io/Turing.js/) <br>
__Docs:__ [TBD](#api-reference)

## Demo

```js
/* Super small counter demo */
let Language = require('turingjs').Language;

new Language()
    .token('+', state => { state.data.sum++ })
    .token('-', state => { state.data.sum-- })
    .data('sum', 0)
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
        ']': (state, token) => { state.tokenPointer = state.data.loops.pop() - 1 },
        '[': (state, token) => {
            state.data.loops.push(token.position)
            if (state.stack[state.index] === 0) {
                return (state, token) => {
                    if (token.value === '[') { state.data.loops.push(NaN) }
                    if (token.value === ']') { state.data.loops.pop() }
                    return state.data.loops.length === 0;
                };
            }
        }
    })
    .on('eof', state => state.data.loops.length === 0)
    .data({ in: [], out: [], loops: [] });

brainfuck
    .data({ in: 'ABC'.split('') })
    .run('+++[->,.+++.<]')
    .then(finalState => console.log(finalState.data.out.join(''))/* ADBECF */)
    .catch(error => console.log(error));
```
</details>

## Developing

### Built with

* [Lodash](https://lodash.com/)
* [Typescript](https://www.typescriptlang.org/)
* [Mocha](https://mochajs.org/)

### Prerequisites

* [Git](https://git-scm.com/)
* [Node.js](https://nodejs.org/en/)

### Setting up dev

```
git clone git@github.com:Olian04/Turing.js.git
cd Turing.js
npm install
```

### Building

`npm start`

## Tests 

`npm run test`

## Api reference

At the core of every Turing.js language lies a Language object, this object keeps track of what rules your language abides by. It is also this Language object that takes care of executing code written in your new language.

The `Language` object has 4 functions, each with several overloads, `token`, `data`, `on`, and `run`.

Function | Description
------|------------
`token` | Adds TokenHandlers, these are the bread and butter of your languages grammar.
`data` | Provides a way of adding custom state properties to your language's interpreter.
`on` | Adds event handlers for various events fired during an execution of code.
`run` | Runs some code written in your new language.

_I'm working on a full documentation page, for now look at the demos above._

## Update log

#### 1.0
All MVP features have been implemented.
A usable demo consisting of all Brainf**k instruction can be run.

#### 0.1
All basic components have been had their development started.
A usable demo consisting of all Brainf**k instruction, except the loops, can be run.

## Credits
* Logo: https://logomakr.com/6LYfIX
