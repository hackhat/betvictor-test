var React = require('react');
var _     = require('lodash');





/**
 * @class client.ui.Outcome
 * Item to render an outcome.
 */
module.exports = React.createClass({



    displayName: 'outcome',



    contextTypes: {
        data : React.PropTypes.object,
        lang : React.PropTypes.object
    },



    render: function(){
        return React.DOM.a({
            className : 'outcome item',
            // href      : '/' + this.context.data.lang + '/sports/' + this.context.data.sportId + '/events/' + this.context.data.eventId
        },
            React.DOM.span({
                className: 'description'
            }, this.props.description),
            React.DOM.span({
                className: 'price'
            }, this.context.lang['price'] + ': ' + this.props.price)
        )
    }



});
