import { assert, expect } from 'chai';
import * as _ from 'lodash';

import * as turingjs from '../../src/turingjs';

// Tests that the module loads as intended
describe('turingjs.js', function() {
    it("should be importable", function() {
        assert(turingjs);
    }); 
    describe('API', function() {
        it("Language", function() {
            assert.equal(typeof turingjs.Language, 'function');
        });
        it("EventType", function() {
            assert.equal(typeof turingjs.EventType, 'object');
        });
        it("GetTagFunction", function() {
            assert.equal(typeof turingjs.GetTagFunction, 'function');
        });
        it("Skip", function() {
            assert.equal(typeof turingjs.Skip, 'object');
        });
    });
});