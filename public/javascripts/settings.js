$(document).ready(function() {
  var socket = io.connect('http://localhost:3000');
  $('#save').button();

  // Get all Input Ids
  $inputIds = $('#settings input[id]').map(function() {
    return this.id;
  }).get();

  $selectIds = $('#settings select[id]').map(function() {
    return this.id;
  }).get();

  // Request inital settings
  socket.emit('get_settings', {'settingsType': 'server'});

  // Recieve settings
  socket.on('settings', function(data) {

    if (data.error) {
      bootstrap_alert('danger', '<strong>Error:</strong> ' + data.error);
      $('#save').button('reset');

    } else if (data.success) {
      bootstrap_alert('success', '<strong>Success:</strong> ' + data.success, 3000);
      $('#save').button('reset');

    } else if (data.settings) {
      settings = data.settings.settings;
      $("#host").val(settings.host);
      $("#user").val(settings.user);
      $("#pass").val(settings.pass);
      $("#auth_type").val(settings.auth_type);

    } else {
      console.log("Nothing recieved");

    }

    $('#save').button('reset');
  });

  // Handle Clicking Save
  $('#save').click(function() {
    $(this).button('loading');
    $(this).prop('disabled', true);
    $('#settings').submit();
  });

  // Submit form data
  $('#settings').submit(function(event) {
    var postData = {}
    if (typeof($inputIds.length) !== "undefined") {
      for ( var i = 0; i < $inputIds.length; i++) {
        postData[$inputIds[i]] = $('#' + $inputIds[i]).val();
      }
    }
    if(typeof($selectIds.length) !== "undefined") {
      for (var i = 0; i < $selectIds.length; i++) {
        postData[$selectIds[i]] = $('#' + $selectIds[i]).val().toLowerCase();
      }
    }
    if(postData) {
      socket.emit('set_settings', {'settingsType': 'server', 'settings': postData});
    }
    console.log(postData);
    event.preventDefault();
  });
});