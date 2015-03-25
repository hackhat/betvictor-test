var React    = require('react');
var _        = require('lodash');
var Sports   = require('./Sports');
var Events   = require('./Events');
var Outcomes = require('./Outcomes');
var en_US    = require('client/i18n/en_US');
var pt_PT    = require('client/i18n/pt_PT');
// This is for a simple project, therefore we can just use
// "en" instead of the full name "en_US".
var languages = {
    en: en_US,
    pt: pt_PT
}





/**
 * @class client.ui.Root
 * Root of the application.
 */
module.exports = React.createClass({



    displayName: 'root',



    childContextTypes: {
        data : React.PropTypes.object,
        lang : React.PropTypes.object
    },



    getChildContext: function(){
        return {
            data: this.props.data,
            lang: languages[this.props.data.lang]
        };
    },



    render: function(){
        var content;
        if(this.props.data.sports){
            content = React.createElement(Sports, {sports: this.props.data.sports})
        }
        if(this.props.data.events){
            content = React.createElement(Events, {events: this.props.data.events})
        }
        if(this.props.data.outcomes){
            content = React.createElement(Outcomes, {outcomes: this.props.data.outcomes})
        }
        return React.DOM.div({
            className: 'root'
        }, content)
    }



});
