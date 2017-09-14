import { assert, expect } from 'chai';
import * as _ from 'lodash';

import { Language, EventType, GetTagFunction, Skip } from '../../src/turingjs';

describe('On', function() {
    describe('unexpectedToken', function() {
        let lang = new Language<{ unexpected: string[], expected: string[] }>()
            .on(EventType.unexpectedToken, (state, token) => { 
                state.data.unexpected.push(token.value);
                return true; 
            })
            .token('+', (state, token) => { state.data.expected.push(token.value); } )
            .data({
                unexpected: [],
                expected: []
            });

        it('should execute up until the first unexpected token', function() {
            return lang
                .run('++++++1+2++3+++')
                .then(state => {
                    assert(state.data.expected[0] === '+' 
                        && state.data.unexpected[0] === '1');
                });
        });

        it('should trigger exactly once per unexpected token', function() {
            return lang
                .run('+1+2++3+++')
                .then(state => {
                    assert(_.isEqual(state.data.unexpected, ['1', '2', '3'] ));
                });
        });
    });
});