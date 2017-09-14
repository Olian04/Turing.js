import { assert, expect } from 'chai';
import * as _ from 'lodash';

import { Language, EventType, GetTagFunction, Skip } from '../../src/turingjs';

describe('Language: Counter (synchronous)', function() {
    describe('OK', function() {
        let lang = new Language<{ sum: number }>()
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