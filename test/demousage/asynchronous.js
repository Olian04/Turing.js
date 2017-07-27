let assert = require('assert');
let Language = require('../../dist/turingjs').Language;


describe('Demo usage ran asynchronous', function() {
    describe('empty', function() {
        let lang = new Language();
        it('', function() {
            lang.run('')
                .then( state => {
                    assert.deepEqual(state.data, {});
                })
                .catch(error => {
                    assert.fail();
                });
        });
    });
    describe('error', function() {
        let lang = new Language();
        it('err', function() {
            lang.run('err')
                .then( state => {
                    assert.fail();
                })
                .catch(error => {
                    assert.ok(true);
                });
        });
    });
    describe('sum (+-)', function() {
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