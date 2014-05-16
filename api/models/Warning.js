/**
 * Warning
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  schema : true,

  attributes: {
    warningType: {
       type: 'string'
     },
    message: {
      type: 'string',
      required: true
    },
    classname: {
      type: 'string'
    },
    recordid: {
      type: 'string'
    },
    readedby: {
     model: 'user'
    },
    readed: {
     type: 'boolean',
     defaultsTo: false
    },
    user: {
     model: 'user',
     type: 'string'
    },
    inName: function(){
      return this.message ;
    }
  }

};
