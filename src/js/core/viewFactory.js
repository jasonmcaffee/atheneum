var React = require('react');
var dispatcher = require('core/dispatcher');

function viewFactory(viewOptions){
    if(!viewOptions.mixins){viewOptions.mixins = [];}

    var baseMixin = {
        componentWillMount: function() {
            var signal = this.props.signal || dispatcher;
            if(signal){

                for(var prop in this.signals){
                    console.log('signal on: ' + prop);
                    signal.on(prop, this.signals[prop], this);
                }
            }
        },
        componentWillUnmount: function() {
            var signal = this.props.signal || dispatcher;
            if(signal){
                for(var prop in this.signals){
                    console.log('signal off: ' + prop);
                    signal.off(prop, this.signals[prop], this);
                }
            }
        }
    };

    viewOptions.mixins.push(baseMixin);

    return React.createClass(viewOptions);
}

module.exports = viewFactory;