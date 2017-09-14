import { assert, expect } from 'chai';
import * as _ from 'lodash';

import { Language, EventType, GetTagFunction, Skip } from '../../src/turingjs';

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