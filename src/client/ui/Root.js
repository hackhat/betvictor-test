var React    = require('react');
var SmartCSS = require('smart-css');
var _        = require('lodash');





module.exports = function(options){
    options = _.extend({
    }, options);
    var data = options.data;





    var css = new SmartCSS();



    css.setClass('root', {
        backgroundColor : 'black',
        maxWidth        : '360px',
        margin          : '0 auto',
    })





    return React.createClass({



        displayName: 'root',



        render: function(){
            return React.DOM.div({
                className: css.getClass('root')
            }, this.props.data)
        }



    });



}
