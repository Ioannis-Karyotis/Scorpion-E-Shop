"use strict";

const nodemailer = require('nodemailer');
const fs = require('fs');

let DefaultTransport = null;

function Email(config) {
    config = config || {};

    ['to', 'from', 'cc', 'bcc', 'replyTo', 'subject', 'body', 'bodyType'].forEach(function (key) {
        if(key == 'body' && config['bodyType'] == 'html'){
            this['html'] = config[key];
        } 
        else if(key == 'body' && !config['bodyType']){
            this['text'] = config[key];
        }
        else {
            this[key] = config[key];
        }
    }, this);
}

Email.prototype = {
    send: function (callback) {
        var transport = nodemailer.createTransport(DefaultTransport);

        transport.sendMail(this, function (error, info) {
            if (error) {
                transport.close();
                callback(error);
            } else {
                transport.close();
                callback(info);
            }
        });
    }
}

module.exports = {
    UseZohoSMTPTransport: function (config) {
        DefaultTransport = {
            host: 'smtp.zoho.com',
            port: 465,
            secure: true,
            pool: config.pool?config.pool:false,
            auth: {
                type: 'login',
                user: config.username,
                pass: config.password
            }
        }
    },
    LoadHTMLFromFile: function(config){
        var mailTemplate = fs.readFileSync(config.path, 'utf8'); 
		
		for (var i in config.replacers) {
        	mailTemplate = mailTemplate.replace(new RegExp(i, "g"), config.replacers[i]);
        }
        
        return mailTemplate;
    },
    Email: Email
}


