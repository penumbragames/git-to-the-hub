/**
 * @fileoverview This is a class on the client side that handles the drawing
 *   and update of the lobby.
 * DEPENDS ON JQUERY
 * @author alvin.lin.dev@gmail.com (Alvin Lin)
 */


/**
 * Constructor for a Lobby class.
 * @constructor
 * @param {Object} socket
 * @param {Element} lobbyContainerElement
 * @param {Element} playersContainerElement
 * @param {Object} roomsContainerElement
 * @param {Object} roomNameInput
 * @param {Object} roomCreateButton
 */
function Lobby(socket, lobbyContainerElement, playersContainerElement,
               roomsContainerElement, roomNameInput, roomCreateButton) {
  this.socket = socket;
  this.lobbyContainerElement = lobbyContainerElement;
  this.playersContainerElement = playersContainerElement;
  this.roomsContainerElement = roomsContainerElement;
  this.roomNameInput = roomNameInput;
  this.roomCreateButton = roomCreateButton;

  this.socketId = null;
  this.username = null;
}

/**
 * Factory method for creating a Lobby.
 * @param {Object} socket The socket connected to the server.
 */
Lobby.create = function(socket) {
  var lobbyContainerElement = $('#game-lobby-container');
  var playersContainerElement = $('#players-container');
  var roomsContainerElement = $('#rooms-container');
  var roomNameInput = $('#room-name-input');
  var roomCreateButton = $('#create-room-button');
  lobby = new Lobby(socket, lobbyContainerElement, playersContainerElement,
      roomsContainerElement, roomNameInput, roomCreateButton);
  lobby.init();
  return lobby;
};

/**
 * This method binds the necessary event listeners to the socket and the
 * necessary elements.
 */
Lobby.prototype.init = function() {
  var context = this;

  this.socket.emit('new-player', {}, bind(this, function(data) {
    if (!data['success']) {
      window.alert(data.message);
      window.location = '/';
      return;
    }
    this.username = data['username'];
    this.socketId = data['socketId'];
  }));

  this.socket.on('lobby-state', bind(this, this.update));

  this.roomCreateButton.click(function() {
    var roomName = context.roomNameInput.val();
    context.socket.emit('create-room', {
      roomName: roomName
    }, function(status) {
      if (!status['success']) {
        console.log(status['message']);
      }
    })
  });
};

/**
 * @param {Object} data
 */
Lobby.prototype.update = function(data) {
  var context = this;

  if (this.username) {
    var self = data['players'][this.socketId];

    if (self['status'] == Constants.STATUS_IN_GAME) {
      this.lobbyContainerElement.show();
    } else {
      // Render the list of players connected to the lobby.
      this.renderPlayers(data['players']);

      /**
       * Depending on the connected player's status, we render either the
       * list of available rooms or the information regarding the current
       * room.
       */
      if (self['status'] == Constants.STATUS_IN_LOBBY) {
        this.renderRooms(data['rooms']);
      } else if (self['status'] == Constants.STATUS_IN_ROOM) {

      } else {
        throw new Error(Constants.BIG_FUCKUP_ERROR);
      }
    }
  }
};

/**
 *
 */
Lobby.prototype.renderPlayers = function(players) {
  var playerIds = Object.keys(players);
  var difference = playerIds.length -
      this.playersContainerElement.children().length;
  while (difference != 0) {
    if (difference > 0) {
      this.playersContainerElement.append($('<div></div>'));
      difference--;
    } else {
      this.playersContainerElement.children().first().remove();
      difference++;
    }
  }
  this.playersContainerElement.find('div').each(function(index) {
    $(this).text(players[playerIds[index]]['username'] +
                 players[playerIds[index]]['status']);
  });
};

/**
 *
 */
Lobby.prototype.renderRooms = function(rooms) {
  var context = this;
  var roomNames = Object.keys(rooms);
  var difference = roomNames.length -
      this.roomsContainerElement.children().length;
  while (difference != 0) {
    if (difference > 0) {
      this.roomsContainerElement.append($('<div></div>'));
      difference--;
    } else {
      this.playersContainerElement.children().first().remove();
      difference++;
    }
  }
  this.roomsContainerElement.find('div').each(function(index) {
    $(this).text(roomNames[index]);
    $(this).off();
    $(this).click(function() {
      context.socket.emit('join-room', {
        roomName: roomNames[index]
      }, function(status) {
        if (!status['success']) {
          window.alert(status['message']);
        }
      })
    });
  });
};
