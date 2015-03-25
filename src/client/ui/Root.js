var React = require('react');
var _     = require('lodash');





return React.createClass({



    displayName: 'root',



    render: function(){
        return React.DOM.div({
            className: 'root'
        }, this.props.data)
    }



});
