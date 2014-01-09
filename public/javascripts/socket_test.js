window.onload = function() {

  var socket = io.connect('http://localhost:3000');
  var output = document.getElementById("output");

  socket.on('for_client', function(data) {
    output.innerHTML = data.data;
  });

};