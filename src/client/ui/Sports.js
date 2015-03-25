var React = require('react');
var _     = require('lodash');
var Sport = require('./Sport');




module.exports = React.createClass({



    displayName: 'sports',



    contextTypes: {
        data : React.PropTypes.object,
        lang : React.PropTypes.object,
    },



    render: function(){
        return React.DOM.div({
            className: 'sports'
        },
            React.DOM.h1({
                className: 'title'
            }, this.context.lang['sports']),
            this.props.sports.map(function(sport){
                sport.key = sport.id;
                return React.createElement(Sport, sport);
            })
        )
    }



});
