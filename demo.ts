import { Language, GetTagFunction, Skip, EventType } from './src/turingjs';

/* The full Brainfuck language */
let brainfuck = new Language<{ in: string[], out: string[], loops: number[] }>()
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
    .on(EventType.eof, state => {
        return state.data.loops.length === 0;
    })
    .data({ in: [], out: [], loops: [] });

brainfuck
    .data({ in: 'ABC'.split('') })
    .run('+++[->,.+++.<]')
    .then(finalState => console.log(finalState.data.out.join(''))/* ADBECF */)
    .catch(error => console.log(error));
    