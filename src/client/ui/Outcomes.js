var React   = require('react');
var _       = require('lodash');
var Outcome = require('./Outcome');





/**
 * @class client.ui.Outcomes
 * A list of outcomes.
 */
module.exports = React.createClass({



    displayName: 'outcomes',



    contextTypes: {
        data : React.PropTypes.object,
        lang : React.PropTypes.object,
    },



    render: function(){
        return React.DOM.div({
            className: 'outcomes'
        },
            React.DOM.h1({
                className: 'title'
            }, this.context.lang['outcomes']),
            this.props.outcomes.map(function(outcome){
                outcome.key = outcome.id;
                return React.createElement(Outcome, outcome);
            })
        )
    }



});
