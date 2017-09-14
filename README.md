[![CircleCI](https://circleci.com/gh/Olian04/Turing.js/tree/master.svg?style=shield&circle-token=b901a939d226b2f1a28e5d2823983da26854ea98)](https://circleci.com/gh/Olian04/Turing.js/tree/master)
![Npm dependancies](https://david-dm.org/olian04/turing.js.svg)

[![Turing.js logo](https://i.imgur.com/Y2g0yiA.png)](https://olian04.github.io/Turing.js/)

# [Turing.js](https://olian04.github.io/Turing.js/)
Turing.js is an Event-Driven-Language-Design-API based on the definition of a  [turing machine](https://en.wikipedia.org/wiki/Turing_machine).

> A Turing machine is an abstract machine that manipulates symbols on a strip of tape according to a table of rules.
> The machine operates on an infinite memory tape divided into discrete cells. The machine positions its head over a cell and "reads"  the symbol there. Then, as per the symbol and its present place in a finite table of user-specified instructions, the machine (i) writes a symbol (e.g. a digit or a letter from a finite alphabet) in the cell, then (ii) either moves the tape one cell left or right, then (iii) (as determined by the observed symbol and the machine's place in the table) either proceeds to a subsequent instruction or halts the computation.

## Stuff

__Install:__ `npm i --save turingjs`

__Docs:__ [TBD](#api-reference)

## Demo

```js
/* The full Brainfuck language */
import { Language, GetTagFunction, Skip } from 'turingjs';

// Step 1: Define a new language
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
            if (state.stack[state.index] === 0) {
                return Skip.until.balanced('[', ']', 1);
            }
            state.data.loops.push(token.position)
        }
    })
    .on('eof', state => state.data.loops.length === 0)
    .data({ in: [], out: [], loops: [] });

// Step 2: Run some code in the new language    
brainfuck
    .data({ in: 'ABC'.split('') })
    .run('+++[->,.+++.<]')
    .then(finalState => console.log(finalState.data.out.join(''))/* ADBECF */)
    .catch(error => console.log(error));

// Same thing as step 2, but using a tag function instead
let bf = GetTagFunction(brainfuck); //  Create tag function
let finalState = bf`+++[->,.+++.<]${{ in: 'ABC'.split('') }}`; // Run some code
console.log(finalState.data.out.join('')); // Get the output: ADBECF 
```

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

`npm run build`

## Tests 

`npm run test`

## Publishing

_Refer to: https://www.tsmean.com/articles/how-to-write-a-typescript-library/_

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
