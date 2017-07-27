let assert = require('assert');
let exec = require('../../dist/execution');

let initState = new exec.ExecutionState();

describe('tokenizeString', function() {
    describe('OK', function() {
        it('empty string', function() {
            let code = '';
            let tokens = exec.tokenizeString(code);
            assert.equal(tokens.length, 0);
        });

        it('arbitrary string', function() {
            let code = 'should be ok with this string';
            let tokens = exec.tokenizeString(code);
            assert.equal(tokens.length, code.length);
        });
    });

    describe('EXPLODE', function() {
        it('no argument', function() {
            let res = false;
            try {
                let tokens = exec.tokenizeString();
            } catch (e) {
                res = true;
            }
            assert.ok(res);
        });

        it('argument is null', function() {
            let res = false;
            try {
                let tokens = exec.tokenizeString(null);
            } catch (e) {
                res = true;
            }
            assert.ok(res);
        });

        it('argument is undefined', function() {
            let res = false;
            try {
                let tokens = exec.tokenizeString(undefined);
            } catch (e) {
                res = true;
            }
            assert.ok(res);
        });

        it('argument is an object', function() {
            let res = false;
            try {
                let tokens = exec.tokenizeString({});
            } catch (e) {
                res = true;
            }
            assert.ok(res);
        });

        it('argument is an array', function() {
            let res = false;
            try {
                let tokens = exec.tokenizeString({});
            } catch (e) {
                res = true;
            }
            assert.ok(res);
        });

        it('argument is a number', function() {
            let res = false;
            try {
                let tokens = exec.tokenizeString(42);
            } catch (e) {
                res = true;
            }
            assert.ok(res);
        });

        it('argument is a bareword', function() {
            let res = false;
            try {
                let tokens = exec.tokenizeString(bareword);
            } catch (e) {
                res = true;
            }
            assert.ok(res);
        });

        it('argument is a function', function() {
            let res = false;
            try {
                let func = function() {}
                let tokens = exec.tokenizeString(func);
            } catch (e) {
                res = true;
            }
            assert.ok(res);
        });
    });
});