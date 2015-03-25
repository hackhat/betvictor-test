var React = require('react');
var _     = require('lodash');
var Event = require('./Event');




module.exports = React.createClass({



    displayName: 'events',



    contextTypes: {
        data : React.PropTypes.object,
        lang : React.PropTypes.object,
    },



    render: function(){
        return React.DOM.div({
            className: 'events'
        },
            React.DOM.h1({
                className: 'title'
            }, this.context.lang['events']),
            this.props.events.map(function(event){
                event.key = event.id;
                return React.createElement(Event, event);
            })
        )
    }



});
