var $ = require('jquery');
var Signal = function() {
    console.log('Signal constructor called');
    this.init();
};
var callbackId = 0;

$.extend(Signal.prototype, {
    init:function(){
        this._signals= {};
    },
    //
    //@param context {object} - optional. the 'this' of the callback will be the context if passed.
    on: function(id, callback, context) {
        if (!this._signals[id]) {
            this._signals[id] = [];
        }
        if (callback.__id) {
            console.error(id + " can only be used with one signal.");
        }
        callback.__id = callbackId++;
        var callbackWithContext = {
            context: context,
            callback: callback
        };
        this._signals[id].push(callbackWithContext);
    },
    // Turn off
    off: function(cb) {
        for (var signal in this._signals) {
            for (var i = 0; i < this._signals[signal].length; i++) {
                var callbackWithContext = this._signals[signal][i];
                if (callbackWithContext.callback.__id === cb.__id) {
                    this._signals[signal].splice(i);
                    return;
                }
            }
        }
    },
    trigger: function(id, data) {

        if (!this._signals[id]) {
            return;
        }

        for (var i = 0; i < this._signals[id].length; i++) {
            var callbackWithContext = this._signals[id][i];
            if (typeof callbackWithContext.callback === "function") {
                //callback(data);
                //context is optional
                if (callbackWithContext.context) {
                    callbackWithContext.callback.call(callbackWithContext.context, data);
                } else {
                    callback(data);
                }
            }
        }
    }
});

module.exports = Signal;