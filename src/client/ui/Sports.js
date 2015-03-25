var React = require('react');
var _     = require('lodash');
var Sport = require('./Sport');




module.exports = React.createClass({



    displayName: 'sports',



    contextTypes: {
        data: React.PropTypes.object
    },



    render: function(){
        return React.DOM.div({
            className: 'sports'
        }, this.props.sports.map(function(sport){
            return React.createElement(Sport, sport);
        }))
    }



});
