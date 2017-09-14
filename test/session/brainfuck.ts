import { assert, expect } from 'chai';
import * as _ from 'lodash';

import { Language, EventType, GetTagFunction, Skip } from '../../src/turingjs';

describe('Language: Brainfuck', function() {
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

    describe('OK', function() {
        it('empty string as code should result in no execution', function() {
            let initialData = { in: ['a'], out: [], loops: [] }
            return brainfuck
                .data(initialData)
                .run('')
                .then(finalState => {
                    if (_.isEqual(finalState.data, initialData)
                        && finalState.tokenPointer === 0
                        && finalState.index === 0
                        && finalState.stack.length === 1
                        && finalState.stack[0] === 0) {
                        assert.ok(true);    
                    } else {
                        assert.fail();
                    }
                })
                .catch(err => assert.fail() );
        });

        it('loop example from readme: ADBECF', function() {
            return brainfuck
                .data({ in: 'ABC'.split('') })
                .run('+++[->,.+++.<]')
                .then(finalState => {
                    assert.equal(finalState.data.out.join(''), 'ADBECF')
                })
                .catch(error => assert.fail() );
        });

        it('should work as a tag function', function() {
            let bf = GetTagFunction(brainfuck); 
            let res = bf`+++[->,.+++.<]${{ in: 'ABC'.split('') }}`;
            assert.equal(res.data.out.join(''), 'ADBECF');
        });
    });
    describe('EXPLODE', function() {
        it('Read character from input when input is empty', function() {
            return brainfuck
                .data({ in: [], out: [], loops: [] })
                .run(',')
                .then(finalState => assert.fail() )
                .catch(err => { 
                    if (err.code === 'ERR_ASSERTION') {
                        // Calling assert.fail in the then callback causes the catch callback to get called with the error of AssertionFailed
                        assert.fail();
                    } else {
                        assert.ok(true); 
                    }
                } );
        });

        it('Exit with unbalanced loop expressions', function() {
            return brainfuck
                .data({ in: [], out: [], loops: [] })
                .run('+[')
                .then(finalState => assert.fail() )
                .catch(err => { 
                    if (err.code === 'ERR_ASSERTION') {
                        // Calling assert.fail in the then callback causes the catch callback to get called with the error of AssertionFailed
                        assert.fail();
                    } else {
                        assert.ok(true); 
                    }
                } );
        });
    });
});