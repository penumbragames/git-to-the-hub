var am = require('../lib/AccountManager');
var lm = require('../lib/LobbyManager.proto');
// var a = am.create();
var l = lm.create();

// a.registerUser('noob', 'password', function(status) {
//   console.log(status);
// });
//
// a.isUserAuthenticated('omgimanerd', 'password', function(status) {
//   console.log(status);
// });

l.printDebug();
l.addPlayer('id1', 'alvin');
l.addPlayer('id2', 'christine');
l.printDebug();
console.log(l.createRoom('summoners rift'));
console.log(l.joinRoom('summoners rift', 'id1', true));
l.printDebug();
console.log(l.setReadyStatus('summoners rift', 'id1', true));
l.printDebug();
