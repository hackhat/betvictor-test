var React  = require('react');
var _      = require('lodash');
var Sports = require('./Sports');
var en_US  = require('client/i18n/en_US');
var pt_PT  = require('client/i18n/pt_PT');
// This is for a simple project, therefore we can just use
// "en" instead of the full name "en_US".
var languages = {
    en: en_US,
    pt: pt_PT
}



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
        return React.DOM.div({
            className: 'root'
        }, React.createElement(Sports, {sports: this.props.data.sports}))
    }



});
