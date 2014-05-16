$(document).ready(function(){

	// Validate
	// http://bassistance.de/jquery-plugins/jquery-plugin-validation/
	// http://docs.jquery.com/Plugins/Validation/
	// http://docs.jquery.com/Plugins/Validation/validate#toptions

		$('#sign-up-form').validate({
	    rules: {
	      name: {
	        required: true
	      },
	      email: {
	        required: true,
	        email: true
	      },
	      password: {
	      	minlength: 6,
	        required: true
	      },
	      confirmation: {
	      	minlength: 6,
	      	equalTo: "#password"
	      }
	    },
			success: function(element) {
				element
				.text('OK!').addClass('valid')
			}
	  });



	$('#mamsendkart').validate({
	    rules: {
	      name: {
	        required: true
	      },
	      to: {
	        required: true,
	        email: true
	      },
	      items:{
	      	required: true,
	      	range:[1,10]
	      }
	    },
		success: function(element) {
			element
			.text('OK!').addClass('valid')
		}
	  });
});