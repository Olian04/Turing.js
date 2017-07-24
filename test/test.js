let assert = require('assert');

// Tests that the module loads as intended
describe('Turingjs', function() {
    let turingjs;
    it("should be importable via require()", function() {
        try {
            turingjs = require('../dist/turingjs');
            assert.ok(true);
        } catch (e) {
            assert.fail();
        }
    }); 
    describe('#exports', function() {
        it("Language", function() {
            assert.equal(typeof turingjs.Language, 'function');
        });
    });
});

// Tests that all exported classes behave as expected
describe('Class', function() {
    let turingjs = require('../dist/turingjs');
    describe('Language', function() {
        it('should be an object', function() {
            assert.equal(typeof new turingjs.Language(), 'object');
        });
        describe('#exports', function() {
            let lang = new turingjs.Language();
            it('.token', function() {
                assert.equal(typeof lang.token, 'function');
            });
            it('.tokens', function() {
                assert.equal(typeof lang.tokens, 'function');
            });
            it('.data', function() {
                assert.equal(typeof lang.data, 'function');
            });
            it('.run', function() {
                assert.equal(typeof lang.run, 'function');
            });
            it('.runSynchronous', function() {
                assert.equal(typeof lang.runSynchronous, 'function');
            });
            it('.eof', function() {
                assert.equal(typeof lang.eof, 'function');
            });
        });
        describe('Synchronous', function() {
            describe('empty', function() {
                let lang = new turingjs.Language();
                it('', function() {
                    lang.runSynchronous('', state => {
                        assert.deepEqual(state.data, {});
                    }, error => {
                        assert.fail();
                    });
                });
            });
            describe('error', function() {
                let lang = new turingjs.Language();
                it('err', function() {
                    lang.runSynchronous('err', state => {
                        assert.fail();
                    }, error => {
                        assert.ok(true);
                    });
                });
            });
            describe('sum (+-)', function() {
                let lang = new turingjs.Language()
                    .tokens({
                        '+': state => { state.data.sum++},
                        '-': state => { state.data.sum-- },
                    })
                    .data({ sum: 0 });
                it('+++-+-', function() {
                    lang.runSynchronous('+++-+-', state => {
                        assert.equal(state.data.sum, 2);
                    }, error => {
                        assert.fail();
                    });
                });
                it('+++++', function() {
                    lang.runSynchronous('+++++', state => {
                        assert.equal(state.data.sum, 5);
                    }, error => {
                        assert.fail();
                    });
                });
                it('-----', function() {
                    lang.runSynchronous('-----', state => {
                        assert.equal(state.data.sum, -5);
                    }, error => {
                        assert.fail();
                    });
                });
            });
        });
        describe('Asynchronous', function() {
            describe('empty', function() {
                let lang = new turingjs.Language();
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
                let lang = new turingjs.Language();
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
                let lang = new turingjs.Language()
                    .tokens({
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
    });
});