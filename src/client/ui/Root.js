var React  = require('react');
var _      = require('lodash');
var Sports = require('./Sports');





module.exports = React.createClass({



    displayName: 'root',



    childContextTypes: {
        data: React.PropTypes.object
    },



    getChildContext: function(){
        return {data: this.props.data};
    },



    render: function(){
        return React.DOM.div({
            className: 'root'
        }, React.createElement(Sports, {sports: this.props.data.sports}))
    }



});
