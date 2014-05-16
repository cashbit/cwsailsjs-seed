/**
 * Comment
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {
	
	author:{
		model:'user',
		type:'string'
	},
	messagge:{
		type:'string'
	},
	topicUrl:{
		type:'string'
	}
    
  }

};
