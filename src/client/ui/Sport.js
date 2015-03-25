var React = require('react');
var _     = require('lodash');





module.exports = React.createClass({



    displayName: 'sport',



    contextTypes: {
        data : React.PropTypes.object,
        lang : React.PropTypes.object
    },



    render: function(){
        return React.DOM.a({
            className : 'sport',
            href      : '/' + this.context.data.lang + '/sports/' + this.props.id
        }, this.props.title)
    }



});
