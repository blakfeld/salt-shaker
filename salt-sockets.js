
/**
 * Handle all sockets for salt-shaker
 */

 Salt_Sockets = function(server) {
  this.io = server;
  console.log("Sockets listening!");
 };

 exports.Salt_Sockets = Salt_Sockets;