$(function() {
    var counter = 0;
    var o = $('div');
    
    function Deferred(initialize) {
        initialize(this.promise())
    };
    Deferred.prototype = {
        doneFuncs: [ ],
        resolve: function() {
            var args = this.arguments = arguments;
            this.doneFuncs.forEach(function(callback) {
                callback.apply(this, args);
            });
            this.doneFuncs = undefined;
        },
        done: function(doneCallback) {
            if (this.doneFuncs)
                this.doneFuncs.push(doneCallback);
            else
                doneCallback.apply(this, this.arguments);
        },
        promise: function() {
            var self = this;
            return {
                done: function(cb) {
                    self.done(cb);
                }
            };
        }
    };
    
    o.click(function() {
        var d = new Deferred(setupDoneFuncs);
        $(this).toggleClass('c').one('transitionend', function() {
            $(this).one('transitionend', function() {
                d.resolve(++counter);
            });
        });
    });
    
    function setupDoneFuncs(promise) {
        var colors = [ '#FCC', 'lightgreen', 'lightblue' ];
        promise.done(function(bgcolor) {
            o.css({ backgroundColor: colors[counter % 3] });
        });
        promise.done(function(label) {
            o.text(label);
        });
    }
    
});