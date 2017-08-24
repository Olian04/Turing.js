const turing = require('./dist/turingjs');
const Language = turing.Language;
const GetTagFunction = turing.GetTagFunction;
const Skip = turing.Skip;

new Language()
    .on('unexpectedToken', (state, token) => { console.log(token); return true; })
    .token('+', (token, state) => {})
    .run('++-+--+')
    .then(state => console.log(state));

/* Super simple counter demo */
new Language()
    .token('+', state => { state.data.sum++ })
    .token('-', state => { state.data.sum-- })
    .data({ sum: 0 })
    .run('+--++-++++')
    .then(state => console.log(state.data.sum)/* 4 */)
    .catch(err => { throw err });


// Tag functions
let counterLanguage = new Language()
    .token('+', state => { state.data.sum++ })
    .token('-', state => { state.data.sum-- })
    .data({ sum: 0 });

let count = GetTagFunction(counterLanguage);
let result = count`++-++`; // Generated tag function
console.log(result.data.sum);


/* The full Brainfuck language */
let brainfuck = new Language()
    .token({
        '+': state => { state.stack[state.index]++ },
        '-': state => { state.stack[state.index]-- },
        '>': state => { state.index++ },
        '<': state => { state.index-- },
        ',': state => { state.stack[state.index] = state.data.in.shift().charCodeAt(0) },
        '.': state => { state.data.out.push(String.fromCharCode(state.stack[state.index])) },
        '[': (state, token) => {
            if (state.stack[state.index] === 0) {
                return Skip.until.balanced('[', ']', 1);
            }
            state.data.loops.push(token.position);
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

let bf = GetTagFunction(brainfuck); // Lets create a tag function
    
brainfuck
    .data({ in: 'ABC'.split('') })
    .run('+++[->,.+++.<]')
    .then(finalState => console.log(finalState.data.out.join(''))/* ADBECF */)
    .catch(error => console.log(error));
    
// Now lets use that tag function
let res = bf`+++[->,.+++.<]${{ in: 'ABC'.split('') }}`;
console.log(res.data.out.join(''));
