const assert = require('chai').assert;

const Distribution = require('../src/distribution');

function createGroup(shape) {
    const result = {};
    for (let k in shape) {
        if (shape.hasOwnProperty(k)) {
            result[k] = new Array(shape[k]);
        }
    }
    return result;
}

describe('distribution', function(){
    it('should determine when frequencies are all the same', function(){
        const d = new Distribution(createGroup({'a': 3, 'b': 3, 'c': 3}));

        assert.isTrue(d.allSame());
    });

    it('should determine when frequencies are **NOT** all the same', function(){
        const d = new Distribution(createGroup({'a': 2, 'b': 3, 'c': 3}));

        assert.isFalse(d.allSame());
    });

    it('should determine when extremas', function(){
        const d = new Distribution(createGroup({'a': 2, 'b': 3, 'c': 3}));

        assert.deepEqual(d.minmax(), {
            minorants: ['a'],
            majorants: ['b', 'c']
        });
    });
});
