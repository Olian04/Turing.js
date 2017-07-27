let assert = require('assert');
let Language = require('../../dist/turingjs').Language;


describe('Demo usage ran synchronous', function() {
    describe('empty', function() {
        let lang = new Language();
        it('', function() {
            lang.run('', state => {
                assert.deepEqual(state.data, {});
            }, error => {
                assert.fail();
            });
        });
    });
    describe('error', function() {
        let lang = new Language();
        it('err', function() {
            lang.run('err', state => {
                assert.fail();
            }, error => {
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
            lang.run('+++-+-', state => {
                assert.equal(state.data.sum, 2);
            }, error => {
                assert.fail();
            });
        });
        it('+++++', function() {
            lang.run('+++++', state => {
                assert.equal(state.data.sum, 5);
            }, error => {
                assert.fail();
            });
        });
        it('-----', function() {
            lang.run('-----', state => {
                assert.equal(state.data.sum, -5);
            }, error => {
                assert.fail();
            });
        });
    });
});