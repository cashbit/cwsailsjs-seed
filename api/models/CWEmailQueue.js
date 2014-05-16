/**
 * CWEmailQueue
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  	attributes: {
  	   
  	},
  
  	afterCreate: function(record, next) {
		var nodemailer = require('nodemailer');
		nodemailer.sendmail = true ;
		nodemailer.send_mail(
		{
			sender: record.from,
			to: record.to,
			cc: record.cc,
			subject:'New order',
			html: record.html,
			body: record.body
		},
		function(err, success){
			if (err) {
				record.err = err.message;
				record.save(function(err) {
					next();
				});
			} else {
				next();
			}
		});		
	}
};