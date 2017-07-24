import { Language } from './turingjs';

interface MyData {
  in: string[],
  out: string[],
  loops: number[],
  sum: number,
}
let myLang = new Language<MyData>()
    .tokens({
        '+': state => { state.stack[state.index]++; state.data.sum++},
        '-': state => { state.stack[state.index]--; state.data.sum-- },
        '>': state => { state.index++ },
        '<': state => { state.index-- },
        ',': state => { state.stack[state.index] = state.data.in.shift().charCodeAt(0) },
        '.': state => { state.data.out.push(String.fromCharCode(state.stack[state.index])) },
    })
    .data({
        in: 'ABC'.split(''),
        out: [],
        loops: [],
        sum: 0
     });

let code = ',.+++.>,.+++.>,.+++.';

myLang.run(code) // Returns a promise 
    .then(finalState => console.log(finalState))
    .catch(error => console.log(error));

myLang.runSynchronous(code, finalState => {
    console.log(finalState);
}, error => {
    console.log(error);
});