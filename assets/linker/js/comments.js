var _comments = {

	self: this,

	isOpen : false,

	createCommentIdFromPathName: function(){
		// /project/show/52ceb89d0de80bed6d000006
		var pathname = window.location.pathname ;
		var pathnameElements = pathname.split('/') ;
		if (pathnameElements.length === 4){
			return pathnameElements[1] + '_' + pathnameElements[4] ;
		} else {
			return false ;
		}
	},
	
	init: function(){

		// check if we are in a 'show' action... if YES we will show the comment footer
		
		// http://localhost:1337/project/show/52ceb89d0de80bed6d000006

		var canShowComments = false ;
		var pathname = window.location.pathname ;
		var pathnameElements = pathname.split('/') ;
		if (pathnameElements.length === 4){
			canShowComments = (pathnameElements[2] === 'show') || (pathnameElements[2] === 'edit') ;
		}
		if (canShowComments){
			$('._comments').fadeIn();
		} else {
			$('._comments').fadeOut();
		}

		$('#comment_comment').keypress(this.keypressHandler) ;
		socket.on('message', _comments.socketMessage);
		this.receive();
	},

	toggle: function(){
		this.isOpen = !this.isOpen ;
		var height = 50 ;
		if (this.isOpen) height = 200 ;
		$('._comments').animate({height:height+'px'},300);
		$('#comment_openclose').toggleClass('glyphicon-chevron-up glyphicon-chevron-down');
	},

	send: function(){
		var commentId = this.createCommentIdFromPathName() ;
		if (!commentId){
			return ;
		}
		var message = $('#comment_comment').val() ;
		socket.get('/comment/add',{
			topicUrl: commentId,
			message: message
		}, function (response) {
		  if (response.success){
			$('#comment_comment').val('') ;
		  }
		});
	},

	receive: function(){
		var self = this ;
		var commentId = this.createCommentIdFromPathName() ;
		if (!commentId){
			return ;
		}
		socket.get('/comment',{topicUrl: commentId},
			function(response){
				if (response.success){
					var commentsHtml = [] ;
					for (var i=response.comments.length-1;i>=0;i--){
						var comment = response.comments[i] ;
						commentsHtml.push(self.createComment(comment)) ;
					}
					$('#comment_content').html(commentsHtml.join('\n')) ;
				}
			}
		) ;
	},

	createComment: function(comment){

		var encodedMessage = $('<div/>').text(comment.message).html();

		var commentString = [] ;

		commentString.push('<div class="row">') ;
		
		commentString.push('<div class="col-md-6">') ;
		commentString.push('<strong>'+comment.authorName+'</strong>');
		commentString.push('</div>') ;

		commentString.push('<div class="col-md-6 text-right">') ;
		commentString.push('<em><small>('+comment.createdAt+')</small></em>');
		commentString.push('</div>') ;

		commentString.push('</div>') ;

		commentString.push('<div>') ;
		commentString.push(encodedMessage);
		commentString.push('</div>') ;


		return '<div>'+commentString.join('\n')+'</div><hr style="border-color:#333333" />' ;
	},

	keypressHandler: function(e){
		 if (e.keyCode == 13) {
			_comments.send();
		 }
	},

	socketMessage: function(message){
		var commentId = _comments.createCommentIdFromPathName() ;
		if (!commentId){
			return ;
		}
		if (message.model !== 'comment') return ;
		if (message.data.topicUrl !== commentId) return ;
		if (message.data.author !== globalUserId) $('#chatAudio')[0].play();
		var commentString = _comments.createComment(message.data) ;
		$('#comment_content').prepend(commentString) ;
	}
};

$(document).ready(function(){
	_comments.init() ;
});
