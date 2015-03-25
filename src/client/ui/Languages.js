var React = require('react');
var _     = require('lodash');





/**
 * @class client.ui.Languages
 * Renders languages.
 */
module.exports = React.createClass({



    displayName: 'languages',



    contextTypes: {
        data : React.PropTypes.object,
        lang : React.PropTypes.object
    },



    render: function(){
        var url = ['/sports'];
        if(this.context.data.sportId){
            url.push('/' + this.context.data.sportId)
        }
        if(this.context.data.eventId){
            url.push('/events/' + this.context.data.eventId)
        }
        return React.DOM.div({
            className : 'languages'
        },
            React.DOM.a({
                className : 'language' + (this.context.data.lang === 'en' ? ' active' : ''),
                href      : '/en' + url.join('')
            }, 'en'),
            React.DOM.a({
                className : 'language' + (this.context.data.lang === 'pt' ? ' active' : ''),
                href      : '/pt' + url.join('')
            }, 'pt')
        )
    }



});
