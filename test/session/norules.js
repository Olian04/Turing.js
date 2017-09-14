let assert = require('assert');
let _ = require('lodash');
let { Language, EventType, GetTagFunction, Skip } =  require('../../dist/turingjs.js');

describe('Language: No rules', function() {
    describe('OK', function() {
        let lang = new Language();
        it('no input code', function() {
            lang.run('')
                .then( state => {
                    assert.deepEqual(state.data, {});
                })
                .catch(error => {
                    assert.fail();
                });
        });
    });
    describe('EXPLODE', function() {
        let lang = new Language();
        it('faulty input code', function() {
            lang.run('err')
                .then( state => {
                    assert.fail();
                })
                .catch(error => {
                    assert.ok(true);
                });
        });
    });
});