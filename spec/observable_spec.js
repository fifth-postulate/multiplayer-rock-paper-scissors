const assert = require('chai').assert;

const Observable = require('../src/observable');

describe('Observable', function(){
    it('registers and notifies observers', function(done){
        var observable = new Observable();
        observable.register(done);

        observable.notify();
    });

    it('passes any arguments to the observer when notified', function(done){
        var observable = new Observable();
        observable.register(function(left, right){
            assert.equal(left, 'left');
            assert.equal(right, 'right');
            done();
        });

        observable.notify('left', 'right');
    });
});
