var App = require('./gameview').App;
function getUrlParameter(name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [, ""])[1].replace(/\+/g, '%20')) || null;
}
exports.SyncedGameState = StatefulThis(function (_a) {
    var yamlCardData = _a.yamlCardData, cardNameDecks = _a.cardNameDecks, playerId = _a.playerId;
    var playerInfo = { gameName: getUrlParameter('game'), userName: getUrlParameter('user'), deck: getUrlParameter('deck'), observer: !!getUrlParameter('observer') };
    connectToServer(onConnect, onGameInfo);
    // Where:
    function onGameInfo(socket, _a) {
        var error = _a.error, gameInfo = _a.gameInfo;
        if (error) {
            console.log(error);
        }
        else if (gameInfo) {
            var creator = gameInfo.creator, players = gameInfo.players, gameState = gameInfo.gameState;
            console.log('got game info:');
            console.log('  creator', creator);
            console.log('  players', players);
            console.log('  gameState', gameState);
            if (!gameState && players.length >= 2) {
                socket.emit('putGameState', { gameState: { deck1: players[0].deck, deck2: players[1].deck } });
            }
        }
        else
            throw new Error();
    }
    function onConnect(socket) {
        console.log('whatup');
        socket.emit('playerInfo', playerInfo);
    }
    function connectToServer(onConnect, onGameInfo) {
        var socket = io('http://184.175.47.177:3000');
        socket.on('connect', function () { return onConnect(socket); });
        socket.on('gameInfo', function (data) { return onGameInfo(socket, data); });
        return socket;
    }
    function onAppLoad() {
    }
    return React.createElement(App, null);
});
