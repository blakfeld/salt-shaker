$(document).ready(function() {
  var socket = io.connect('http://localhost:3000');
  var minion_list = document.getElementById("minions_list");
   $('#refresh').button();
  
  // Request intial minion list
  socket.emit('get_minion_list');

  // Handle recieving minion list
  socket.on('minion_list', function(data) {
    if(data.minions) {
      var minions = data.minions;
      var html = "<ul class='list-group'>";

      for(var i = 0; i < minions.length; i++) {
        html += "<a href='/minions/" + minions[i]['_id'] + "'' class='list-group-item'>" + minions[i].name + "</a>"
      }

      html += "</ul>"
      minion_list.innerHTML = html;
      $('#refresh').button('reset');

    } else {
      minion_list.innerHTML = "<p>Something Broke</p>"
      console.log("There is a problem: ", data);
    }
  });

  // Handle Clicking Refresh  
  $('#refresh').click(function() {
    $(this).button('loading');
    $(this).prop('disabled', true);
    socket.emit('refresh_minion_list');
  });
});