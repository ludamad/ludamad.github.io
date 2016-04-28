var hasOwnProperty = Object.prototype.hasOwnProperty;
var tungus = require('tungus');
var _a = require('lodash'), find = _a.find, values = _a.values, remove = _a.remove;
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
console.log('Starting CardWar server version 0');
console.log('Running mongoose version %s', mongoose.version);
function makeServer(handler) {
    var port = 3000;
    //let ipaddr = "10.0.0.145";
    var app = require('express')();
    var server = require('http').Server(app);
    var io = require('socket.io')(server);
    io.on('connection', function (socket) {
        console.log('New connection');
        var _a = handler(socket), onPlayerInfo = _a.onPlayerInfo, onPutGameState = _a.onPutGameState, onDisconnect = _a.onDisconnect;
        socket.on('playerInfo', onPlayerInfo);
        socket.on('putGameState', onPutGameState);
        socket.on('disconnect', onDisconnect);
    });
    app.set('port', port);
    //app.set('ipaddr', iaddr);
    //io.set('origins', 'http://ludamad.github.io');
    app.get('/', function (req, res) {
        res.sendFile(__dirname + '/index.html');
    });
    server.listen(port, function () {
        console.log('listening on *:' + port);
    });
}
function getProperty(o, k) {
    return hasOwnProperty.call(o, k) ? o[k] : void 0;
}
function newGame(creator) {
    return { creator: creator, players: [], gameState: null, gameStateHistory: [], observers: [] };
}
function stripPlayer(_a) {
    var name = _a.name, deck = _a.deck;
    return { name: name, deck: deck };
}
function startServer() {
    var games = {};
    var players = {};
    var nameToSocket = {};
    return makeServer(handler);
    // Where:
    function emitGameInfo(socket, _a) {
        var creator = _a.creator, players = _a.players, gameState = _a.gameState;
        console.log("Emitting game info");
        players = players.map(stripPlayer);
        creator = stripPlayer(creator);
        socket.emit('gameInfo', { gameInfo: { creator: creator, players: players, gameState: gameState } });
    }
    function handler(socket) {
        var player = { name: null, game: null, deck: null };
        return {
            onPlayerInfo: function (_a) {
                var gameName = _a.gameName, userName = _a.userName, deck = _a.deck, observer = _a.observer;
                console.log(observer ? 'Observer' : 'Player', 'info', gameName, userName);
                if (userName) {
                    player = getProperty(players, userName) || { name: userName, deck: deck, game: null };
                    players[userName] = player;
                    setSocket(player, socket);
                }
                if (deck) {
                    player.deck = deck;
                }
                if (!gameName)
                    return;
                var game = getProperty(games, gameName) || newGame(player);
                games[gameName] = game;
                if (find(game.players, function (_a) {
                    var name = _a.name;
                    return name === userName;
                })) {
                    emitGameInfo(socket, game);
                }
                else if (observer) {
                    game.observers.push(player);
                    emitGameInfo(socket, game);
                }
                else if (game.players.length >= 2) {
                    socket.emit('gameInfo', { error: 'Game was full!' });
                }
                else {
                    game.players.push(player);
                    game.observers.push(player);
                    player.game = game;
                    for (var _i = 0, _b = player.game.players; _i < _b.length; _i++) {
                        var p = _b[_i];
                        emitGameInfo(getSocket(p), game);
                    }
                }
            },
            onDisconnect: function () {
                console.log('Disconnect');
                if (player.name && getSocket(player) === socket) {
                    delete nameToSocket[player.name];
                }
                for (var _i = 0, _a = values(games); _i < _a.length; _i++) {
                    var _b = _a[_i], players_1 = _b.players, observers = _b.observers;
                    remove(players_1, function (_a) {
                        var name = _a.name;
                        return name === player.name;
                    });
                    remove(observers, function (_a) {
                        var name = _a.name;
                        return name === player.name;
                    });
                }
            },
            onPutGameState: function (_a) {
                var gameState = _a.gameState;
                console.log('Got game state for ' + player.name);
                console.log('Players:', gameState && gameState.players);
                if (player.game) {
                    player.game.gameStateHistory.push(gameState);
                    player.game.gameState = gameState;
                    for (var _i = 0, _b = player.game.observers; _i < _b.length; _i++) {
                        var p = _b[_i];
                        if (p !== player) {
                            console.log("Emitting game info to " + p.name);
                            emitGameInfo(getSocket(p), player.game);
                        }
                    }
                }
                else {
                    console.log('... but ' + player.name + ' is not in a game!');
                }
            }
        };
    }
    function getSocket(_a) {
        var name = _a.name;
        return nameToSocket[name];
    }
    function setSocket(_a, socket) {
        var name = _a.name;
        nameToSocket[name] = socket;
    }
}
startServer();
