bootstrap_alert = function(type, message, timeout) {
  $('.alert').alert('close');
  $('#alerts').prepend('<div class="alert alert-'+ type + '"><a class="close" style="margin-bottom: 4px" data-dismiss="alert">&times;</a>' + message + '<div>');


  if (timeout || timeout === 0) {
    setTimeout(function() {
      $(".alert").alert('close');
    }, timeout);    
  }
};