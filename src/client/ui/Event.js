var React = require('react');
var _     = require('lodash');





module.exports = React.createClass({



    displayName: 'event',



    contextTypes: {
        data : React.PropTypes.object,
        lang : React.PropTypes.object
    },



    render: function(){
        return React.DOM.a({
            className : 'event item',
            href      : '/' + this.context.data.lang + '/sports/' + this.context.data.sportId + '/events/' + this.props.id
        },
            React.DOM.span({
                className: 'title'
            }, this.props.title),
            React.DOM.span({
                className: 'score'
            }, this.context.lang['score'] + ': ' + this.props.score),
            React.DOM.span({
                className: 'status'
            }, this.context.lang['status'] + ': ' + this.props.status)
        )
    }



});
