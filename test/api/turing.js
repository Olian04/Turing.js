let assert = require('assert');

// Tests that the module loads as intended
describe('turingjs.js', function() {
    let turingjs;
    it("should be importable via require()", function() {
        try {
            turingjs = require('../../dist/turingjs');
            assert.ok(true);
        } catch (e) {
            assert.fail();
        }
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