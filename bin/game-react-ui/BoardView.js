var React = require('react');
var _a = require('lodash'), shuffle = _a.shuffle, range = _a.range, every = _a.every, find = _a.find, flatten = _a.flatten;
var _b = require('react-motion'), Motion = _b.Motion, spring = _b.spring;
var gs = require('../game-logic-core/gs');
var CardView_1 = require('./CardView');
function cellView(ui, cell, onBackrow) {
    var x = cell.x, y = cell.y;
    var cellClass = ((x + y) % 2 == 0) ? 'whitecell' : "blackcell";
    if (onBackrow) {
        cellClass = 'backrowcell';
    }
    var canAttack = (find(ui.unitAttackSquares, function (c) { return c.x == x && c.y == y; }));
    var canMoveTo = (find(ui.unitMoveSquares, function (c) { return c.x == x && c.y == y; }));
    //    let showRange = canAttack && (!canMoveTo || cell.range <= cell.movement);
    //    let showMove  = canMoveTo && (!canAttack || cell.movement <= cell.range);
    var transform = "translate3d(" + (154.5 / 2 - 12) + "," + (154.5 / 2 - 12) + "px,0)";
    var elStyle = { margin: 'auto', width: '154px', height: '154px', opacity: '0.2', position: 'absolute', translate: 'translate3d(0px,0px,3px)' };
    var element = (React.createElement("div", null, cell.temple ? React.createElement("img", {"src": 'images/temple_CC0.png', "alt": "Temple", "style": { position: 'absolute' }}) : React.createElement("div", null), canAttack ? React.createElement("img", {"src": 'images/range.png', "alt": "Range", "className": 'nodrag', "style": elStyle}) : React.createElement("div", null), canMoveTo ? React.createElement("img", {"src": 'images/movement.png', "alt": "Movement", "className": 'nodrag', "style": elStyle}) : React.createElement("div", null)));
    return React.createElement("div", {"className": cellClass, "key": x + ', ' + y, "onClick": function () { return ui.onClickSquare(cell); }, "style": { position: 'absolute', transform: "translate3d(" + x * 154.5 + "px," + (y + 1) * 154.5 + "px,0)" }}, element);
}
function unitView(ui, unit, mini) {
    gs.assert(unit.instanceId != null);
    gs.assert(!!unit.card, 'should be unit');
    var selected = (ui.selectedUnit === unit);
    var outline = '';
    if (selected) {
        outline = '2px solid green';
    }
    else {
        outline = '2px solid yellow';
    }
    if (ui.playerId != unit.playerId) {
        if (find(ui.unitAttackSquares, function (c) { return c.x == unit.x && c.y == unit.y; })) {
            outline = '5px solid red';
        }
        else {
            outline = '2px solid red';
        }
    }
    var card = JSON.parse(JSON.stringify(unit.card));
    card.unitData.health = unit.health;
    function motionRender(_a) {
        var tX = _a.tX, tY = _a.tY;
        if (!mini) {
            tX -= 0.4, tY -= 0.4;
        }
        var transform = "translate3d(" + tX * 154.5 + "px," + (tY + 1) * 154.5 + "px," + (mini ? 0.1 : 100) + "px)";
        var onClick = function (e) { return ui.onClickUnit(unit, e); };
        return React.createElement(CardView_1.CardView, {"key": mini + card.name, "className": "whitecell", "transform": transform, "outline": outline, "card": card, "position": "absolute", "mini": mini, "onClick": onClick});
    }
    return React.createElement(Motion, {"key": unit.instanceId, "style": { tX: spring(unit.x), tY: spring(unit.y) }}, motionRender);
}
function RowView(_a) {
    var ui = _a.ui, row = _a.row;
    return range(gs.BOARD_WIDTH).map(function (x) { return cellView(ui, row[x], false); });
}
function BackRowView(_a) {
    var ui = _a.ui, backrow = _a.backrow;
    return range(gs.BOARD_WIDTH).map(function (x) { return cellView(ui, backrow[x], true); });
}
function bringToBack(arr, el) {
    var ind = arr.indexOf(el);
    if (ind === -1)
        return arr;
    arr = arr.filter(function (s) { return s !== el; });
    arr.push(el);
    return arr;
}
function BoardView(_a) {
    var ui = _a.ui, gameState = _a.gameState;
    return React.createElement("div", {"className": "board", "style": { position: 'absolute' }}, BackRowView({ ui: ui, backrow: gameState.backrows[0] }), flatten(range(gs.BOARD_HEIGHT).map(function (y) { return RowView({ ui: ui, row: gameState.board[y] }); })), bringToBack(gs.getActiveUnits(gameState), ui.selectedUnit).map(function (unit) { return unitView(ui, unit, ui.selectedUnit !== unit); }), BackRowView({ ui: ui, backrow: gameState.backrows[1] }), gameState.actionLog.map(function (msg) { return React.createElement("div", null, msg); }));
}
exports.BoardView = BoardView;
