var gs = require("./gs");
var React = require('react');
var ReactBlessed = require('react-blessed');
var App = require('../gameview').App;
var DIRECTIONS = [
    0 /* FORWARD */, 2 /* FORWARD_RIGHT */, 5 /* FORWARD_LEFT */,
    6 /* LEFT */, 3 /* RIGHT */,
    1 /* BACKWARD */, 4 /* BACKWARD_RIGHT */, 7 /* BACKWARD_LEFT */
];
function aiMatch() {
    var state = gs.newGameState([gs.randomDeck(), gs.randomDeck()]);
    var board = state.board, _a = state.backrows, backrow1 = _a[0], backrow2 = _a[1];
    for (var _i = 0, _b = state.players; _i < _b.length; _i++) {
        var player = _b[_i];
        for (var i = 0; i < 5; i++) {
            gs.drawCard(state, player);
        }
    }
    gs.placeUnit(state, 0, 2, 5, PLAYTEST_CARDS[1].unit);
    gs.placeUnit(state, 1, 2, 0, PLAYTEST_CARDS[1].unit);
    gs.placeUnit(state, 1, 2, 2, PLAYTEST_CARDS[1].unit);
    gs.placeUnit(state, 1, 2, 3, PLAYTEST_CARDS[1].unit);
    gs.assert(!!backrow1);
    gs.assert(!!backrow2);
    var finished = false;
    var screen = getScreen();
    var Component = React.createClass({
        getInitialState: function () {
            return { state: state };
        },
        componentDidMount: function () {
            //this.setState({state});
            //doTurn(this);
        },
        render: function () {
            var state = this.state.state;
            if (state) {
                return React.createElement(App, {"onMouser": function () { return null; }, "selectedFilter": function () { return false; }, "state": state});
            }
            else {
                return React.createElement("element", null);
            }
        }
    });
    ReactBlessed.render(React.createElement(Component, null), screen);
    return;
    // Where:
    function doTurn(ref) {
        gs.gameTurnStart(state);
        moveRandomUnit();
        attackWithRandomUnit();
        gs.gameTurnEnd(state);
        ref.setState({ state: state });
        setInterval((function (_) {
            doTurn(ref);
        }), 5000);
    }
    function getScreen() {
        var blessed = require('blessed');
        var screen = blessed.screen({
            autoPadding: true,
            smartCSR: true,
            title: 'react-blessed demo app'
        });
        screen.key(['escape', 'q', 'C-c'], function (ch, key) {
            return process.exit(0);
        });
        return screen;
    }
    function moveUnitRandomly(unit) {
        var squares = gs.unitMoveSquares(state, unit, []);
        var square = gs.randomPick(squares);
        if (!square) {
            return false;
        }
        gs.doUnitMove(state, unit, square);
        return true;
    }
    function attackWithUnitRandomly(unit) {
        var squares = gs.unitAttackSquares(state, unit, []);
        var square = gs.randomPick(squares);
        if (!square) {
            return false;
        }
        gs.doUnitAttack(state, unit, square);
        return true;
    }
    function moveRandomUnit() {
        for (var _i = 0; _i < board.length; _i++) {
            var row = board[_i];
            for (var _a = 0; _a < row.length; _a++) {
                var unit = row[_a];
                if (unit.player === state.playerTurn && gs.unitCanMove(state, unit)) {
                    if (moveUnitRandomly(unit)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
    function attackWithRandomUnit() {
        for (var _i = 0; _i < board.length; _i++) {
            var row = board[_i];
            for (var _a = 0; _a < row.length; _a++) {
                var unit = row[_a];
                if (unit.player === state.playerTurn && gs.unitHasAttacksLeft(state, unit)) {
                    if (attackWithUnitRandomly(unit)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
    function print() {
        console.log(backrow1.map(function (br) { return br.city ? 'C' : 'c'; }).join(' '));
        for (var _i = 0; _i < board.length; _i++) {
            var row = board[_i];
            console.log(row.map(function (unit) { return (unit.cardId ? (unit.player ?
                PLAYTEST_CARDS[unit.cardId].name.charAt(0).toLowerCase() :
                PLAYTEST_CARDS[unit.cardId].name.charAt(0).toUpperCase()) : '-'); }).join(' '));
        }
        console.log(backrow2.map(function (br) { return br.city ? 'C' : 'c'; }).join(' '));
    }
}
exports.aiMatch = aiMatch;
aiMatch();
