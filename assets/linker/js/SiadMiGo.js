function checkWarnings(){
    $.ajax({
      url: '/warning/count'
    }).done(function(data) {
        $('#warningCounter').html(data.warningCount);
    });
}

function checkItemsInKart(){
    $.ajax({
      url: '/mamkart/count'
    }).done(function(data) {
        $('#itemKartCounter').html(data.itemCount);
    });
}

function checkMePlus(){
    $.ajax({
      url: '/meplus/count'
    }).done(function(data) {
        $('#meplusCounter').html(data.meplusCount);
    });
}

function meplus(){
  var title = window.document.title ;
  var titleSplit = window.document.title.split('::') ;
  if (titleSplit.length == 2){
    title = titleSplit[1] ;
  }

  socket.request('/meplus/add', {
    title: title,
    url: window.location.href
  }, function (response) {
    // Here's what the server responded with
    if (response.mepluses){
      checkMePlus();
    } else {
      console.log(response) ;
    }
  });
}


function fileUploadRemove(id,className){
  socket.request('/fileuploads/remove/'+id,{classname:className},function(response){
    if (response.ok){
      $('#fileUpload_' + id).remove();
    } else {
      console.log(response) ;
    }
    if (typeof(onFileRemove) == 'function'){
      onFileRemove(id,className,response) ;
    }
  });
}


function fileUploadRemoveSelected(attachmentClassName){
  var selected = $('.fileUploadCheckBoxes') ;
  for (var i=0;i<selected.length;i++){
    var selectedelement = selected[i] ;
    if (selectedelement.checked){
      var fileupload_id = selectedelement.id ;
      var id = fileupload_id.split('_')[1] ;
      fileUploadRemove(id,attachmentClassName) ;    
    }
  }
}

function addToKart(recordId,className){
  if ( $('#addToKartButton').html() == 'OK !!') return ;
  socket.request('/mamkart/addtokart', {
      recordId: recordId ,
      className: className
    }, function (response) {
      // Here's what the server responded with
      $('#addToKartButton').html('OK !!') ;
      checkItemsInKart();
    });
}

$(document).ready(function(){
  var links = $('.navbarlink') ;
  for (var l in links){
    var link = links[l] ;
    if  (link.pathname == window.location.pathname){
      $(link).parent().addClass('active') ;
    }
  }


  var breadCrumbsLink = $('.breadCrumbLink') ;
  for (var bl in breadCrumbsLink){
    var blink = breadCrumbsLink[bl] ;
    if  (blink.pathname == window.location.pathname){
      $(blink).parent().addClass('active') ;
    }
  }

  checkWarnings();
  checkMePlus();
  checkItemsInKart() ;

  Dropzone.options.myAwesomeDropzone = {
    init: function() {
      this.on('success', function(data,response) {
        if (response.id){
          $('.attachedfiles').append(
            '<li id="fileUpload_' +
            response.id +
            '"><input class="fileUploadCheckBoxes" type="checkbox" id="fileUploadCheck_' +
            response.id +
            '" />\n<a href="/fileuploads/receive/' +
            response.id+
            '">' +
            response.filename +
            '</a></li>'
            );
        }
        if (typeof(onFileUpload) == 'function'){
          onFileUpload(data,response) ;
        }
      });
    }
  };


});
