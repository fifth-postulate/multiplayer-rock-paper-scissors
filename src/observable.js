function Observable() {
    this.observers = [];
};
Observable.prototype.register = function(observer){
    this.observers.push(observer);
};
Observable.prototype.notify = function(){
    const args = Array.prototype.slice.call(arguments);
    this.observers.forEach(function(observer){
        observer.apply(observer, args);
    }.bind(this));
}

module.exports = Observable;

