/**
 * Fileuploads
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {
	
	schema : true,

	attributes: {
		
		/* e.g.
		nickname: 'string'
		*/
		user:{
			model: 'user',
			type: 'string'
		},
		private: {
			type: 'boolean',
			defaultsTo: true
		},
		path: 'string',
		classname: 'string',
		recordid: 'string',
		originaldata: 'json'

	}

};
