const assert = require('chai').assert;

const group = require('../src/group');

describe('group', function(){
    it('should group same keys with same values', function(){
        [
            { input: { 'a': 'option' }, expected: { 'option': ['a'] } },
            { input: { 'a': 'optionA',
                       'b': 'optionB' }, expected: { 'optionA': ['a'], 'optionB': ['b'] } },
            { input: { 'a': 'optionA',
                       'b': 'optionB',
                       'c': 'optionA' }, expected: { 'optionA': ['a', 'c'], 'optionB': ['b'] } },
        ].forEach(function(testCase){
            var result = group(testCase.input);

            assert.deepEqual(result, testCase.expected);
        });
    });
});
