var tungus = require('tungus');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
console.log('Starting CardWar server version 0');
console.log('Running mongoose version %s', mongoose.version);
function makeServer(onConnection, handlerFactory) {
    var app = require('express')();
    var http = require('http').Server(app);
    var io = require('socket.io')(http);
    io.on('connection', function (socket) {
        onConnection(socket);
        var _a = handlerFactory(socket), onChatMessage = _a.onChatMessage, onUserName = _a.onUserName, onCreateGame = _a.onCreateGame, onJoinGame = _a.onJoinGame, getGameState = _a.getGameState, getPlayerDeck = _a.getPlayerDeck;
        socket.on('chatMessage', onChatMesage);
        socket.on('userName', onUserName);
        socket.on('createGame', onCreateGame);
        socket.on('joinGame', onJoinGame);
        socket.on('getDeck', function () {
            socket.emit('deck', getPlayerDeck());
        });
        socket.on('getGameState', function () {
            socket.emit('gameState', getGameState());
        });
        socket.on('putGameState', function (gameState) {
            socket.emit('gameState', getGameState());
        });
    });
}
;
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});
http.listen(3000, function () {
    console.log('listening on *:3000');
});
function startServer() {
    function onConnection() {
    }
    function handlerFactory(socket) {
        return {};
    }
    makeServer(onConnection, handlerFactory);
}
var GameReplay = mongoose.model('GameReplay', Schema({
    players: Array }, states, Array));
;
var UserData = mongoose.model('UserData', Schema({
    name: String,
    deck: String,
    games: [{ type: Schema.Types.ObjectId, ref: 'GameReplay' }]
}));
/*
var gameSchema = Schema({
    name: String
  , developer: String
  , released: Date
  , consoles: [{ type: Schema.Types.ObjectId, ref: 'GameConsole' }]
})
var Game = mongoose.model('Game', gameSchema);
*/
mongoose.connect('tingodb://' + __dirname + '/data', function (err) {
    // if we failed to connect, abort
    if (err)
        throw err;
    // we connected ok
    createData();
});
/**
 * Data generation
 */
/*
function getUserData() {
    GameReplay.create({
    })
}

function createData () {
  GameConsole.create({
      name: 'Nintendo 64'
    , manufacturer: 'Nintendo'
    , released: 'September 29, 1996'
  }, function (err, nintendo64) {
    if (err) return done(err);

    Game.create({
        name: 'Legend of Zelda: Ocarina of Time'
      , developer: 'Nintendo'
      , released: new Date('November 21, 1998')
      , consoles: [nintendo64]
    }, function (err) {
      if (err) return done(err);
      example();
    })
  })
}
function example () {
  Game
  .findOne({ name: /^Legend of Zelda/ })
  .populate('consoles')
  .exec(function (err, ocinara) {
    if (err) return done(err);
    console.log(ocinara);

    console.log(
        '"%s" was released for the %s on %s'
      , ocinara.name
      , ocinara.consoles[0].name
      , ocinara.released.toLocaleDateString());

    done();
  })
}

function done (err = null) {
  if (err) console.error(err);
  GameConsole.remove(function () {
    Game.remove(function () {
      mongoose.disconnect();
    })
  })
}
*/
