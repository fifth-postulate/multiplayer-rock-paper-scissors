const assert = require('chai').assert;

const difference = require('../src/difference');

describe('difference', function(){
    it('of lists are the elements contained in the first not contained in the second', function(){
        assert.deepEqual(difference([1,2,3], []), [1, 2, 3]);
        assert.deepEqual(difference([1,2,3], [1]), [2, 3]);
        assert.deepEqual(difference([1,2,3], [2]), [1, 3]);
        assert.deepEqual(difference([1,2,3], [3]), [1, 2]);
        assert.deepEqual(difference([1,2,3], [1, 2]), [3]);
        assert.deepEqual(difference([1,2,3], [1, 3]), [2]);
        assert.deepEqual(difference([1,2,3], [2, 3]), [1]);
    });
});
