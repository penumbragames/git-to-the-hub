/**
 * @fileoverview This is the client side script for game.html.
 * @author alvin.lin.dev@gmail.com (Alvin Lin)
 */

var socket = io();
var game = Game.create(socket, $('#leaderboard')[0], $('#canvas')[0]);

$(document).ready(function() {
  $('#name-input').focus();
  
  $('#name-form').submit(function() {
    var name = $('#name-input').val();
    
    socket.emit('new-player', {
      name: name
    }, function(data) {
      if (data['success']) {
        $('#prompt').hide();
        $('#canvas').focus();
      } else {
        window.alert(data['message']);
      }
    });

    return false;
  });

/*
  socket.emit('new-player', {
    name: 'blarg'
  }, function(data) {
    if (!data['success']) {
      window.alert(data['message']);
    }
  });
*/
  
  init();
});

function init() {
  game.init();
  game.animate();
}
