let assert = require('assert');
let _ = require('lodash');
let { Language, EventType, GetTagFunction, Skip } =  require('../../dist/turingjs.js');

describe('On', function() {
    describe('unexpectedToken', function() {
        let lang = new Language()
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