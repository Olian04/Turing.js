import { assert, expect } from 'chai';
import * as _ from 'lodash';

import { ExecutionState, tokenizeString } from '../../src/execution';

let initState = new ExecutionState();

describe('tokenizeString', function() {
    describe('OK', function() {
        it('empty string', function() {
            let code = '';
            let tokens = tokenizeString(code);
            assert.equal(tokens.length, 0);
        });

        it('arbitrary string', function() {
            let code = 'should be ok with this string';
            let tokens = tokenizeString(code);
            assert.equal(tokens.length, code.length);
        });
    });

    describe('EXPLODE', function() {
        it('argument is null', function() {
            let res = false;
            try {
                let tokens = tokenizeString(null);
            } catch (e) {
                res = true;
            }
            assert.ok(res);
        });

        it('argument is undefined', function() {
            let res = false;
            try {
                let tokens = tokenizeString(undefined);
            } catch (e) {
                res = true;
            }
            assert.ok(res);
        });
    });
});