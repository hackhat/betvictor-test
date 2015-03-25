var React = require('react');
var _     = require('lodash');





/**
 * @class client.ui.Sport
 * Item to render a sport.
 */
module.exports = React.createClass({



    displayName: 'sport',



    contextTypes: {
        data : React.PropTypes.object,
        lang : React.PropTypes.object
    },



    render: function(){
        return React.DOM.a({
            className : 'sport item',
            href      : '/' + this.context.data.lang + '/sports/' + this.props.id
        }, this.props.title)
    }



});
