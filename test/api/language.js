let assert = require('assert');
let Language = require('../../dist/turingjs').Language;

describe('language.js', function() {
    it('Language should be an object', function() {
        assert.equal(typeof new Language(), 'object');
    });
    describe('API', function() {
        let lang = new Language();
        it('.token', function() {
            assert.equal(typeof lang.token, 'function');
        });
        it('.data', function() {
            assert.equal(typeof lang.data, 'function');
        });
        it('.run', function() {
            assert.equal(typeof lang.run, 'function');
        });
        it('.on', function() {
            assert.equal(typeof lang.on, 'function');
        });
    });
});