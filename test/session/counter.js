let assert = require('assert');
let Language = require('../../dist/turingjs').Language;

describe('Language: Counter', function() {
    describe('OK', function() {
        let lang = new Language()
            .token({
                '+': state => { state.data.sum++},
                '-': state => { state.data.sum-- },
            })
            .data({ sum: 0 });
        it('+++-+-', function() {
            lang.run('+++-+-')
                .then( state => {
                    assert.equal(state.data.sum, 2);
                })
                .catch(error => {
                    assert.fail();
                });
        });
        it('+++++', function() {
            lang.run('+++++')
                .then( state => {
                    assert.equal(state.data.sum, 5);
                })
                .catch(error => {
                    assert.fail();
                });
        });
        it('-----', function() {
            lang.run('-----')
                .then( state => {
                    assert.equal(state.data.sum, -5);
                })
                .catch(error => {
                    assert.fail();
                });
        });
    });
});
