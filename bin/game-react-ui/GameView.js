var React = require('react');
var _a = require('lodash'), shuffle = _a.shuffle, sample = _a.sample, pull = _a.pull, range = _a.range, every = _a.every, flatten = _a.flatten;
var Draggable = require('react-draggable');
var gs = require('../game-logic-core/gs');
var CardView_1 = require('./CardView');
var card_1 = require('../card');
var BoardView_1 = require('./BoardView');
var react_utils_1 = require("./react-utils");
var applyDiff = require("deep-diff").applyDiff;
var Dropdown = require('react-dropdown').default;
exports.TextInputButton = react_utils_1.StatefulThis(function (_a) {
    var _this = this;
    var text = _a.text, onClick = _a.onClick, disallowBlank = _a.disallowBlank;
    return (React.createElement("div", null, React.createElement("button", {"onClick": function () { return (_this.state.input || !disallowBlank) && onClick(_this.state.input || ''); }}, text), React.createElement("input", {"type": "text", "onChange": function (_a) {
        var value = _a.target.value;
        return _this.setState({ input: value });
    }})));
});
function ResourceOptions(_a) {
    var ui = _a.ui, _b = _a.player, gold = _b.gold, miracle = _b.miracle, soul = _b.soul, deck = _b.deck, e = _a.opponent;
    return React.createElement("div", {"style": { border: '10px solid black', width: "420px", backgroundColor: '#FCFCFC' }}, React.createElement("div", null, " ", React.createElement("div", null, "Your resources:"), React.createElement(card_1.ResourceCount, {"gold": gold, "miracle": miracle, "soul": soul, "onClick": ui.onResourceClick}), " "), React.createElement("div", null, " ", React.createElement("div", null, "Your opponent's resources:"), React.createElement(card_1.ResourceCount, {"gold": e.gold, "miracle": e.miracle, "soul": e.soul}), " "), React.createElement("div", null, " Your opponent has ", e.hand.length, " cards and ", e.triggers.length, " triggers. "), React.createElement("div", null, " Your deck has ", deck.length, " cards, your opponent's has ", e.deck.length, " cards left. Damage per turn begins at 0 cards. "), React.createElement("div", null, " ", React.createElement("button", {"onClick": ui.onNextTurn}, "Next turn"), " "), React.createElement("div", null, " ", React.createElement("button", {"onClick": ui.onUndo}, "Undo last action"), " "), React.createElement("div", null, " ", React.createElement("button", {"onClick": ui.onDiscardCard}, "Discard selected card"), " "), React.createElement("div", null, " ", React.createElement(exports.TextInputButton, {"disallowBlank": true, "onClick": ui.onSetSoul, "text": "Set your soul:"}), " "), React.createElement("div", null, " ", React.createElement(exports.TextInputButton, {"disallowBlank": true, "onClick": ui.onSetOpponentSoul, "text": "Set your opponent's soul:"}), " "), React.createElement("div", null, " ", React.createElement(exports.TextInputButton, {"disallowBlank": true, "onClick": ui.onSetGold, "text": "Set your gold:"}), " "), React.createElement("div", null, " ", React.createElement(exports.TextInputButton, {"disallowBlank": true, "onClick": ui.onSetMiracle, "text": "Set your miracle:"}), " "));
}
exports.ResourceOptions = ResourceOptions;
function DrawOptions(_a) {
    var ui = _a.ui;
    return React.createElement("div", null, "Card effects:", React.createElement("div", {"style": { border: '10px solid black', width: "420px", backgroundColor: '#FCFCFC' }}, React.createElement("div", null, " ", React.createElement(exports.TextInputButton, {"disallowBlank": true, "onClick": ui.onUnitSetHp, "text": "Set selected unit's HP."}), " "), React.createElement("div", null, " ", React.createElement("button", {"onClick": ui.onUnitDestroy}, "Destroy selected unit."), " "), React.createElement("div", null, " ", React.createElement("button", {"onClick": ui.onTriggerDestroy}, "Destroy random enemy trigger."), " "), React.createElement("div", null, " ", React.createElement("button", {"onClick": ui.onDraw}, "Draw next card"), " "), React.createElement("div", null, " ", React.createElement(exports.TextInputButton, {"disallowBlank": true, "onClick": ui.onTutorCard, "text": "Draw specific card:"}), " "), React.createElement("div", null, " ", React.createElement(exports.TextInputButton, {"disallowBlank": true, "onClick": ui.onTutorTrait, "text": "Draw card with trait:"}), " "), React.createElement("div", null, " ", React.createElement(exports.TextInputButton, {"disallowBlank": true, "onClick": ui.onCreateCard, "text": "Create specific card:"}), " "), React.createElement("div", null, " ", React.createElement("button", {"onClick": ui.onShuffleDeck}, "Shuffle your deck"), " "), React.createElement("div", null, " ", React.createElement(exports.TextInputButton, {"onClick": ui.onGainMinion, "text": "Gain minion card."}), " ")));
}
exports.DrawOptions = DrawOptions;
function dropDown(i, ui, card, element) {
    function onChange(element) {
        alert(element);
    }
    if (ui.selectedCard !== card)
        return element;
    return (React.createElement("div", null, " ", element, " ", React.createElement(Dropdown, {"options": ["Play", "Discard", "Shuffle"], "onChange": onChange}), " "));
}
function HandView(_a) {
    var ui = _a.ui, hand = _a.hand;
    var outline = (function (i) { return ui.selectedCard === hand[i] ? '2px solid green' : ''; });
    var cards = range(hand.length).map(function (i) { return (React.createElement(CardView_1.CardView, {"key": i, "outline": outline(i), "card": hand[i], "mini": false, "onClick": function () { return ui.onClickCard(hand[i]); }})); });
    var handStyle = { width: 2 * 285 + "px", minHeight: 261 + "px", border: '10px solid black', backgroundColor: '#FCFCFC' };
    return React.createElement("div", null, "Current hand:", React.createElement("div", {"className": 'handle', "style": handStyle}, cards.length ? cards : React.createElement("div", null)));
}
exports.HandView = HandView;
function SelectedCardView(_a) {
    var ui = _a.ui;
    var card = ui.selectedCard || (ui.selectedUnit && ui.selectedUnit.card);
    var cardEl = React.createElement("div", null);
    if (card) {
        cardEl = React.createElement(CardView_1.CardView, {"card": card});
    }
    var handStyle = { width: 1 * 270 + "px", minHeight: 261 * 1 + "px", border: '10px solid black', backgroundColor: '#FCFCFC' };
    return (React.createElement("div", null, "Current selected card:", React.createElement("div", {"className": 'handle', "style": handStyle}, cardEl)));
}
exports.SelectedCardView = SelectedCardView;
function TriggerView(_a) {
    var ui = _a.ui, triggers = _a.triggers;
    var cards = range(triggers.length).map(function (i) { return React.createElement(CardView_1.CardView, {"key": i, "card": triggers[i], "mini": false, "onClick": function () { return ui.onClickTrigger(triggers[i]); }}); });
    var triggersStyle = { minWidth: 6 * 154.5 + "px", height: 261 * 1 + "px", border: '10px solid black', backgroundColor: '#FCFC00' };
    return React.createElement("div", null, "Your triggers:", React.createElement("div", {"className": 'handle', "style": triggersStyle}, cards.length ? cards : React.createElement("div", null)));
}
exports.TriggerView = TriggerView;
function GameControls(_a) {
    var ui = _a.ui, gameState = _a.gameState;
    var player = gameState.players[ui.playerId], opponent = gameState.players[1 - ui.playerId];
    return React.createElement("div", null, React.createElement(HandView, {"ui": ui, "hand": gameState.players[ui.playerId].hand}), React.createElement("div", {"style": { display: 'inline-block', verticalAlign: 'top' }}, React.createElement(ResourceOptions, {"ui": ui, "player": player, "opponent": opponent}), React.createElement(DrawOptions, {"ui": ui})));
    //<div style={{display: 'inline-block', verticalAlign: 'top'}}> 
    //<SelectedCardView ui={ui}/>
    //</div>
}
exports.GameControls = GameControls;
function GameView(_a) {
    var gameState = _a.gameState, ui = _a.ui;
    var transform = "translate3d(" + (154.5 * 6 + 20) + "px," + 0 + "px,0)";
    var triggerTransform = "translate3d(" + 0 + "px," + (154.5 * 8 + 20) + "px,0)";
    var triggers = gameState.players.map(function (p) { return p.triggers; });
    return (React.createElement("div", {"style": { position: 'absolute' }}, React.createElement("div", {"className": "board", "style": { position: 'absolute' }}, React.createElement(BoardView_1.BoardView, {"gameState": gameState, "ui": ui})), React.createElement("div", {"style": { position: 'absolute', transform: triggerTransform }}, React.createElement(TriggerView, {"ui": ui, "triggers": triggers[ui.playerId]})), React.createElement("div", {"style": { position: 'absolute', transform: transform }}, "User name: " + getUrlParameter('user'), React.createElement(GameControls, {"gameState": gameState, "ui": ui}))));
}
exports.GameView = GameView;
function GameSessionView(_a) {
    var ui = _a.ui, gameState = _a.gameSession.gameState;
    return GameView({ gameState: gameState, ui: ui });
}
exports.GameSessionView = GameSessionView;
var _hasOwnProperty = Object.prototype.hasOwnProperty;
function getProperty(obj, key) {
    return _hasOwnProperty.call(obj, key) ? obj[key] : void 0;
}
function getUrlParameter(name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [, ""])[1].replace(/\+/g, '%20')) || null;
}
function loadGameSessionFromServer(netUpdate, gameSession, yamlCardData, cardNameDeck) {
    var playerInfo = { gameName: getUrlParameter('game'), userName: getUrlParameter('user'), deck: cardNameDeck, observer: !!getUrlParameter('observer') };
    var socket = io('http://184.175.47.177:3000');
    console.log("Connecting to 'http://184.175.47.177:3000'");
    socket.on('connect', onConnect);
    return putGameState;
    // Where:
    function putGameState(gameState) {
        console.log("Putting game state");
        socket.emit('putGameState', { gameState: gameState });
    }
    function onEmptyGame(creator, players) {
        console.log("Getting empty game state");
        if (creator.name !== playerInfo.userName || players.length < 2) {
            return; // Not the creator. Just wait.
        }
        gs.gameSessionStart(gameSession, getPlayerId(players), players.map(function (p) { return p.name; }), players.map(function (p) { return p.deck; }));
        for (var _i = 0, _a = gameSession.gameState.players; _i < _a.length; _i++) {
            var player = _a[_i];
            for (var i = 0; i < (player.playerId === 0 ? 4 : 5); i++) {
                var card;
                if (card = player.deck.pop()) {
                    console.log(player.name, 'drawing');
                    gs.playerAddHandCard(player, card);
                }
            }
        }
        putGameState(gameSession.gameState);
        netUpdate();
    }
    function onNonEmptyGame(gameState) {
        console.log("Getting nonempty game state");
        if (gameSession.gameState.players[0].name) {
            var pid = getPlayerId(gameState.players);
            // Exempt changes to our player, except for soul
            gameSession.gameState.players[pid].soul = gameState.players[pid].soul;
            gameState.players[pid] = gameSession.gameState.players[pid];
        }
        applyDiff(gameSession.gameState, gameState);
        gs.saveGameSessionState(gameSession);
        netUpdate();
    }
    function getPlayerId(players) {
        // Figure out player ID:
        var playerId = 0;
        for (var _i = 0; _i < players.length; _i++) {
            var name_1 = players[_i].name;
            if (name_1 === playerInfo.userName) {
                return playerId;
            }
            playerId++;
        }
    }
    function onGameInfo(_a) {
        var error = _a.error, gameInfo = _a.gameInfo;
        if (error) {
            console.log(error);
        }
        else if (gameInfo) {
            var creator = gameInfo.creator, players = gameInfo.players, gameState = gameInfo.gameState;
            gameSession.localPlayerId = getPlayerId(players);
            console.log('got game info:');
            console.log('  creator', creator);
            console.log('  players', players);
            console.log('  gameState', gameState);
            if (!gameState) {
                onEmptyGame(creator, players);
            }
            else {
                onNonEmptyGame(gameState);
            }
        }
        else
            throw new Error();
    }
    function onConnect() {
        console.log("Connected to 'http://184.175.47.177:3000'");
        socket.emit('playerInfo', playerInfo);
        socket.on('gameInfo', onGameInfo);
    }
}
var appRef = null;
exports.App = React.createClass({
    componentDidMount: function () {
        console.log("APP MOUNT");
        if (!this.state.__putgame) {
            appRef = this.isMounted() ? this : null;
            function updateState() {
                if (appRef)
                    appRef.updateState(false);
            }
            this.state.putGameState = loadGameSessionFromServer(updateState, this.state.gameSession, this.props.yamlCardData, this.props.cardNameDeck);
            this.state.__putgame = true;
        }
    },
    updateState: function (putState) {
        if (putState === void 0) { putState = true; }
        gs.saveGameSessionState(this.state.gameSession);
        if (putState) {
            this.state.putGameState(this.state.gameSession.gameState);
        }
        this.forceUpdate();
    },
    getInitialState: function () {
        return {};
    },
    render: function () {
        var _this = this;
        var _a = this.props, yamlCardData = _a.yamlCardData, cardNameDeck = _a.cardNameDeck;
        //console.log('App', cardNameDecks, playerId)
        if (!this.state.gameSession) {
            this.state.gameSession = gs.newGameSessionFromYamlFormat(yamlCardData);
            this.state.cardsRequiredToDiscard = 0;
        }
        if (!this.state.putGameState) {
            this.state.putGameState = function () { };
        }
        var _b = this.state, gameSession = _b.gameSession, selectedCard = _b.selectedCard, selectedUnit = _b.selectedUnit, cardsRequiredToDiscard = _b.cardsRequiredToDiscard;
        var gameState = gameSession.gameState, previousGameStates = gameSession.previousGameStates, cardDataMap = gameSession.cardDataMap, playerId = gameSession.localPlayerId;
        var player = gameState.players[playerId];
        var onUndo = function () {
            if (previousGameStates.length >= 2) {
                previousGameStates.pop();
                applyDiff(_this.state.gameSession.gameState, previousGameStates.pop());
                _this.state.selectedCard = null;
                _this.state.selectedUnit = null;
                _this.updateState();
            }
        };
        var onDraw = function () {
            var card;
            if (card = player.deck.pop()) {
                player.hand.push(JSON.parse(JSON.stringify(card)));
                _this.updateState();
            }
            console.log(card, 'card');
        };
        var onDiscardCard = function () {
            if (selectedCard) {
                gs.removeHandCard(gameState, selectedCard);
                _this.updateState();
            }
        };
        var onNextTurn = function () {
            var card;
            for (var i = 0; i < 2; i++) {
                if (i == 1) {
                    if (gs.inPlay(gameState, 'Salumite Sentinel')) {
                        break;
                    }
                }
                if (card = player.deck.pop()) {
                    player.hand.push(JSON.parse(JSON.stringify(card)));
                }
            }
            player.miracle += gs.MIRACLE_PER_TURN;
            player.gold += gs.GOLD_PER_TURN;
            _this.updateState();
        };
        var onShuffleDeck = function (card) {
            shuffle(player.deck);
            _this.updateState();
        };
        var tutor = function (card) {
            gs.playerAddHandCard(player, card);
            gs.removeDeckCard(gameState, card);
            shuffle(player.deck);
            _this.updateState();
        };
        var onCreateCard = function (cardName) {
            var card = getProperty(cardDataMap, cardName);
            if (card) {
                tutor(card);
                return;
            }
        };
        var onTutorCard = function (cardName) {
            for (var _i = 0, _a = player.deck; _i < _a.length; _i++) {
                var card = _a[_i];
                if (card.name === cardName) {
                    tutor(card);
                    return;
                }
            }
        };
        var toTrait = function (traitName) {
            var _CardTraits;
            (function (_CardTraits) {
                // Unit traits
                _CardTraits[_CardTraits["HitAndRun"] = 1] = "HitAndRun";
                _CardTraits[_CardTraits["Charge"] = 2] = "Charge";
                _CardTraits[_CardTraits["Trapped"] = 4] = "Trapped";
                _CardTraits[_CardTraits["Readystrike"] = 8] = "Readystrike";
                _CardTraits[_CardTraits["Twinstrike"] = 16] = "Twinstrike";
                _CardTraits[_CardTraits["Lanestrike"] = 32] = "Lanestrike";
                _CardTraits[_CardTraits["Initiative"] = 64] = "Initiative";
                _CardTraits[_CardTraits["Aegis"] = 128] = "Aegis";
                _CardTraits[_CardTraits["Returning"] = 256] = "Returning";
                _CardTraits[_CardTraits["Easysummon"] = 512] = "Easysummon";
                _CardTraits[_CardTraits["Structure"] = 1024] = "Structure";
                _CardTraits[_CardTraits["Despelled"] = 2048] = "Despelled";
                _CardTraits[_CardTraits["Token"] = 4096] = "Token";
                _CardTraits[_CardTraits["Reusable"] = 8192] = "Reusable";
                // Spell traits:
                _CardTraits[_CardTraits["Blessing"] = 16384] = "Blessing";
                _CardTraits[_CardTraits["Conjuration"] = 32768] = "Conjuration";
                _CardTraits[_CardTraits["Ritual"] = 65536] = "Ritual";
                _CardTraits[_CardTraits["Trigger"] = 131072] = "Trigger";
                // Arch-type:
                _CardTraits[_CardTraits["Salumite"] = 262144] = "Salumite";
                _CardTraits[_CardTraits["Skullcrusher"] = 524288] = "Skullcrusher";
                _CardTraits[_CardTraits["Warrior"] = 1048576] = "Warrior";
                _CardTraits[_CardTraits["Priest"] = 2097152] = "Priest";
                _CardTraits[_CardTraits["Beast"] = 4194304] = "Beast";
                _CardTraits[_CardTraits["Conjuror"] = 8388608] = "Conjuror";
                _CardTraits[_CardTraits["BaelKai"] = 16777216] = "BaelKai";
                _CardTraits[_CardTraits["Primordial"] = 33554432] = "Primordial";
                _CardTraits[_CardTraits["Leader"] = 67108864] = "Leader";
                _CardTraits[_CardTraits["Controller"] = 134217728] = "Controller";
                // Induced effects on cards:
                _CardTraits[_CardTraits["QuickplayRitual"] = 268435456] = "QuickplayRitual";
            })(_CardTraits || (_CardTraits = {}));
            for (var _i = 0, _a = Object.keys(_CardTraits); _i < _a.length; _i++) {
                var k = _a[_i];
                if (k.toLowerCase() === traitName.toLowerCase()) {
                    return _CardTraits[k];
                }
            }
        };
        var onTutorTrait = function (traitName) {
            var trait = toTrait(traitName);
            if (!trait) {
                return;
            }
            for (var _i = 0, _a = player.deck; _i < _a.length; _i++) {
                var card = _a[_i];
                if (gs.hasTrait(card, trait)) {
                    tutor(card);
                    return;
                }
            }
        };
        var unitMoveSquares = [], unitAttackSquares = [];
        if (selectedUnit) {
            unitMoveSquares = gs.unitMoveSquares(gameState, selectedUnit), unitAttackSquares = gs.unitAttackSquares(gameState, selectedUnit);
        }
        else if (selectedCard && playerId === 0) {
            for (var _i = 0, _c = [[1, 0], [2, 0], [3, 0], [4, 0]]; _i < _c.length; _i++) {
                var _d = _c[_i], x = _d[0], y = _d[1];
                unitMoveSquares.push(gameState.board[y][x]);
            }
        }
        else if (selectedCard && playerId === 1) {
            for (var _e = 0, _f = [[1, 5], [2, 5], [3, 5], [4, 5]]; _e < _f.length; _e++) {
                var _g = _f[_e], x = _g[0], y = _g[1];
                unitMoveSquares.push(gameState.board[y][x]);
            }
        }
        var onGainMinion = function (traits) {
            var Miracle = 0, Gold = 0, AnyCost = 0, Range = 1, Movement = 1, Health = 1, Description = ' ', Traits = (traits + ' Minion').split(' ').filter(function (s) { return s != ''; }), Image = '';
            player.hand.push(gs.yamlFormatToInternalFormat(0, { name: 'Minion', Miracle: Miracle, Gold: Gold, AnyCost: AnyCost, Range: Range, Movement: Movement, Health: Health, Description: Description, Image: Image, Traits: Traits }));
            _this.updateState();
        };
        var onClickCard = function (card, type) {
            _this.state.selectedUnit = null;
            if (_this.state.selectedCard === card) {
                type = 'play';
            }
            else if (player.hand.length > 6) {
                type = 'shuffle';
            }
            else if (_this.state.cardsRequiredToDiscard > 0) {
                type = 'discard';
            }
            if (!card.unitData && type === 'play') {
                if (card.traits & 131072 /* Trigger */) {
                    _this.state.cardsRequiredToDiscard += 1;
                }
                gs.doPlaySpellCard(gameState, card, null);
                _this.state.selectedCard = null;
                _this.updateState();
            }
            else if (type === 'shuffle') {
                gs.removeHandCard(gameState, card, true);
                _this.updateState();
            }
            else if (type === 'discard' || type === 'play') {
                gs.removeHandCard(gameState, card);
                _this.state.cardsRequiredToDiscard = Math.max(_this.state.cardsRequiredToDiscard - 1, 0);
                _this.updateState();
            }
            else {
                _this.state.selectedCard = card;
                _this.forceUpdate();
            }
        };
        var onClickSquare = function (square) {
            if (selectedCard && selectedCard.unitData) {
                _this.state.selectedCard = null;
                if (!gs.unitIsActive(gameState, square)) {
                    gs.doSummonUnit(gameState, playerId, selectedCard, square);
                    gs.removeHandCard(gameState, selectedCard);
                    _this.updateState();
                }
                _this.forceUpdate();
            }
            else if (selectedUnit === square) {
                _this.state.selectedUnit = null;
                _this.forceUpdate();
            }
            else if (selectedUnit && gs.unitIsActive(gameState, square)) {
                gs.doUnitDamage(gameState, square);
                _this.updateState();
            }
            else if (selectedUnit) {
                _this.state.selectedUnit = null;
                gs.doMoveUnit(gameState, selectedUnit, square);
                _this.updateState();
            }
        };
        var onClickTrigger = function (card) {
            gs.removeTriggerCard(gameState, card);
            _this.updateState();
        };
        var onClickUnit = function (unit, _a) {
            var type = _a.type;
            if (type === 'contextmenu') {
                _this.state.selectedUnit = null;
                gs.doUnitDamage(gameState, unit, 1);
                _this.updateState();
            }
            else if (selectedCard && gs.hasTrait(selectedCard, 245760 /* Spell */)) {
                gs.doPlaySpellCard(gameState, selectedCard, unit);
                gs.removeHandCard(gameState, selectedCard);
                _this.state.selectedCard = null;
                _this.updateState();
            }
            else if (_this.state.selectUnit === unit) {
                _this.state.selectedUnit = null;
            }
            else {
                _this.state.selectedUnit = unit;
            }
            _this.state.selectedCard = null;
            _this.forceUpdate();
        };
        var onSetGold = function (gold) {
            if (isNaN(+gold)) {
                return;
            }
            player.gold = +gold;
            _this.updateState();
        };
        var onSetSoul = function (soul) {
            if (isNaN(+soul)) {
                return;
            }
            player.soul = +soul;
            _this.updateState();
        };
        var onSetOpponentSoul = function (soul) {
            if (isNaN(+soul)) {
                return;
            }
            gameState.players[1 - playerId].soul = +soul;
            _this.updateState();
        };
        var onSetMiracle = function (miracle) {
            if (isNaN(+miracle)) {
                return;
            }
            player.miracle = +miracle;
            _this.updateState();
        };
        var onResourceClick = function (_a) {
            var type = _a.type;
            player.gold += (type === 'contextmenu' ? -1 : +1);
            player.miracle += (type === 'contextmenu' ? +1 : -1);
            _this.updateState();
        };
        var onUnitSetHp = function (hp) {
            if (selectedUnit && !isNaN(+hp)) {
                selectedUnit.health = +hp;
                _this.updateState();
            }
        };
        var onUnitDestroy = function () {
            if (selectedUnit) {
                gs.unitReset(selectedUnit);
                _this.updateState();
            }
        };
        var onUnitCopy = function () {
            if (selectedUnit) {
                gs.playerAddHandCard(player, selectedUnit.card);
                _this.updateState();
            }
        };
        var onTriggerDestroy = function () {
            for (var _i = 0, _a = gameState.players; _i < _a.length; _i++) {
                var p = _a[_i];
                if (p !== player) {
                    var trigger = sample(player.triggers);
                    pull(player.triggers, trigger);
                    _this.updateState();
                    return;
                }
            }
        };
        return React.createElement(GameSessionView, {"ui": {
            unitMoveSquares: unitMoveSquares, unitAttackSquares: unitAttackSquares,
            onUndo: onUndo, onDraw: onDraw, onDiscardCard: onDiscardCard, onNextTurn: onNextTurn, onCreateCard: onCreateCard, onShuffleDeck: onShuffleDeck, onTutorCard: onTutorCard, onTutorTrait: onTutorTrait, onGainMinion: onGainMinion, onClickCard: onClickCard, onClickSquare: onClickSquare, onClickTrigger: onClickTrigger, onClickUnit: onClickUnit,
            onSetGold: onSetGold, onSetSoul: onSetSoul, onSetOpponentSoul: onSetOpponentSoul, onSetMiracle: onSetMiracle, onUnitSetHp: onUnitSetHp, onUnitDestroy: onUnitDestroy, onUnitCopy: onUnitCopy, onTriggerDestroy: onTriggerDestroy, onResourceClick: onResourceClick,
            playerId: playerId, selectedCard: selectedCard, selectedUnit: selectedUnit }, "gameSession": this.state.gameSession});
    }
});
