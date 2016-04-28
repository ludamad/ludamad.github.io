/// <reference path="./types.ts"/>
var Random = require("random-js");
var _a = require("lodash"), shuffle = _a.shuffle, map = _a.map, merge = _a.merge, values = _a.values, pull = _a.pull;
var random = new Random(Random.engines.mt19937().autoSeed());
function randomInt(a, b) {
    return random.integer(a, b);
}
exports.randomInt = randomInt;
function randomPick(data) {
    return data[randomInt(0, data.length - 1)];
}
exports.randomPick = randomPick;
exports.MAX_CARDS_IN_HAND = 6;
exports.BOARD_WIDTH = 6, exports.BOARD_HEIGHT = 6;
exports.TEMPLE_LANE1 = 2, exports.TEMPLE_LANE2 = 3;
exports.BEGINNING_SOUL_POINTS = 5;
exports.GOLD_PER_TURN = 2;
exports.MIRACLE_PER_TURN = 2;
function randomDeck() {
    return [];
}
exports.randomDeck = randomDeck;
function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}
exports.deepClone = deepClone;
function nextTurnGoldPerTurn(current) {
    return Math.min(10, current * 2);
}
exports.nextTurnGoldPerTurn = nextTurnGoldPerTurn;
exports.EMPTY_ARRAY = [];
var EFFECT_CACHE = { cache: {}, effectVectors: {} };
function addEffect(effects, effect) {
    var cache = EFFECT_CACHE;
    for (var _i = 0; _i < effects.length; _i++) {
        var e = effects[_i];
        if (e === effect) {
            return effects;
        }
        cache = (cache[e] = cache[e] || { cache: {}, effectVectors: {} });
    }
    cache = (cache[effect] = cache[effect] || { cache: {}, effectVectors: {} });
    return (cache.effectVectors[effect] = cache.effectVectors[effect] || effects.concat([effect]));
}
exports.addEffect = addEffect;
function addEffects(effects1, effects2) {
    for (var _i = 0; _i < effects2.length; _i++) {
        var e2 = effects2[_i];
        effects1 = addEffect(effects1, e2);
    }
    return effects1;
}
exports.addEffects = addEffects;
function assert(cond, message) {
    if (!cond)
        throw new Error(message || "Assertion failed");
}
exports.assert = assert;
function assertNotEmptyOnBoard(state, unit) {
    assertNotEmpty(unit);
    assertOnBoard(state, unit);
}
exports.assertNotEmptyOnBoard = assertNotEmptyOnBoard;
function assertOnBoard(state, unit) {
    for (var _i = 0, _a = state.board; _i < _a.length; _i++) {
        var row = _a[_i];
        for (var _b = 0; _b < row.length; _b++) {
            var boardUnit = row[_b];
            if (boardUnit === unit) {
                assert(state.board[unit.y][unit.x] === unit, "not right unit");
                return;
            }
        }
    }
    assert(false, "not on board");
}
exports.assertOnBoard = assertOnBoard;
function assertNotEmpty(unit) {
    assert(!!unit.card, "Cannot apply to empty square");
}
exports.assertNotEmpty = assertNotEmpty;
function newUnitData() {
    return {
        health: 0,
        movement: 0,
        range: 0,
        traits: 0
    };
}
exports.newUnitData = newUnitData;
function newSquare(x, y, temple) {
    if (temple === void 0) { temple = null; }
    return merge(newUnitData(), { temple: temple, x: x, y: y, card: null, instanceId: null, playerId: null, moveActionsDone: 0, attackActionsDone: 0 });
}
exports.newSquare = newSquare;
function unitReset(unit) {
    unit.playerId = -1;
    unit.card = null;
    unit.instanceId = null;
}
exports.unitReset = unitReset;
function doDestroyUnit(state, unit) {
    // TODO add hooks later
    unitReset(unit);
}
exports.doDestroyUnit = doDestroyUnit;
function doUnitDamage(state, unit, damage) {
    if (damage === void 0) { damage = 1; }
    assertOnBoard(state, unit);
    assertNotEmpty(unit);
    unit.health -= damage;
    if (unit.health <= 0) {
        doDestroyUnit(state, unit);
    }
}
exports.doUnitDamage = doUnitDamage;
//
// Direction tables
//
function dirToDy(dir) {
    if (dir === 2 /* FORWARD_RIGHT */ || dir === 5 /* FORWARD_LEFT */ || dir === 0 /* FORWARD */) {
        return 1;
    }
    if (dir === 4 /* BACKWARD_RIGHT */ || dir === 7 /* BACKWARD_LEFT */ || dir === 1 /* BACKWARD */) {
        return -1;
    }
    return 0;
}
var hasOwnProperty = Object.prototype.hasOwnProperty;
function arrayCopy(dst, src) {
    dst.length = 0;
    for (var _i = 0; _i < src.length; _i++) {
        var s = src[_i];
        dst.push(s);
    }
    return dst;
}
exports.arrayCopy = arrayCopy;
function deepCopy(dst, src) {
    if (src == null || typeof src !== 'object') {
        return src;
    }
    if (Array.isArray(dst)) {
        if (src.length <= 0 || typeof src[0] === 'string' || typeof src[0] === 'number') {
            return src; // Can share the value, it must be a cached array.
        }
        // Otherwise, copy over the elements deep copy style.
        assert(src.length === dst.length);
        var n = 0;
        for (var _i = 0; _i < src.length; _i++) {
            var s = src[_i];
            dst[n] = deepCopy(dst[n], s);
            n++;
        }
        return dst;
    }
    else {
        for (var key in src) {
            if (hasOwnProperty.call(src, key)) {
                dst[key] = deepCopy(dst[key], src[key]);
            }
        }
    }
    return dst;
}
exports.deepCopy = deepCopy;
function out(o, s) {
    console.log("*** " + s);
    console.log(o);
    console.log("--- " + s);
}
exports.out = out;
function doMoveUnit(state, unit, newSquare) {
    newSquare.health = unit.health;
    newSquare.movement = unit.movement;
    newSquare.range = unit.range;
    newSquare.traits = unit.traits;
    newSquare.playerId = unit.playerId;
    newSquare.card = unit.card;
    newSquare.instanceId = unit.instanceId;
    newSquare.moveActionsDone = unit.moveActionsDone + 1;
    newSquare.attackActionsDone = unit.attackActionsDone;
    unitReset(unit);
}
exports.doMoveUnit = doMoveUnit;
function playerHas(state, player, name) {
    var board = state.board;
    for (var y = 0; y < exports.BOARD_HEIGHT; y++) {
        for (var x = 0; x < exports.BOARD_WIDTH; x++) {
            if (unitIsActive(state, board[y][x])) {
                if (board[y][x].card.name === name) {
                    return true;
                }
            }
        }
    }
    return false;
}
exports.playerHas = playerHas;
function inPlay(state, name) {
    for (var _i = 0, _a = state.players; _i < _a.length; _i++) {
        var player = _a[_i];
        if (playerHas(state, player, name)) {
            return true;
        }
    }
    return false;
}
exports.inPlay = inPlay;
function doSummonUnit(state, playerId, card, unit) {
    var unitData = card.unitData;
    var owner = state.players[playerId];
    owner.gold -= card.goldCost;
    owner.miracle -= card.miracleCost;
    for (var i = 0; i < card.anyCost; i++) {
        if (owner.gold >= owner.miracle) {
            owner.gold--;
        }
        else {
            owner.miracle--;
        }
    }
    unit.health = unitData.health;
    unit.movement = unitData.movement;
    unit.range = unitData.range;
    unit.traits = unitData.traits;
    unit.playerId = playerId;
    unit.card = card;
    unit.instanceId = (state.nextInstanceId++);
    unit.moveActionsDone = 0;
    unit.attackActionsDone = 0;
    console.log(unit.x, unit.y);
}
exports.doSummonUnit = doSummonUnit;
// Returns false if not possible
function doPlaySpellCard(state, card, unit) {
    assert(!card.unitData, "Cannot play unit as spell card!");
    var owner = getCardOwner(state, card);
    if (!owner) {
        return;
    }
    owner.gold -= card.goldCost;
    owner.miracle -= card.miracleCost;
    for (var i = 0; i < card.anyCost; i++) {
        if (owner.gold >= owner.miracle) {
            owner.gold--;
        }
        else {
            owner.miracle--;
        }
    }
    // Was it a trigger spell card ?
    if (hasTrait(card, 131072 /* Trigger */)) {
        playerAddTrigger(owner, card);
        state.actionLog.push("Trigger played by " + owner.playerId);
    }
    else if (unit) {
        state.actionLog.push(card.name + " on " + unit.card.name);
    }
    else {
        state.actionLog.push("" + card.name);
    }
    if (!hasTrait(card, 256 /* Returning */)) {
        removeHandCard(state, card);
    }
}
exports.doPlaySpellCard = doPlaySpellCard;
function dirToDx(dir) {
    if (dir >= 2 /* FORWARD_RIGHT */ && dir <= 4 /* BACKWARD_RIGHT */) {
        return 1;
    }
    if (dir >= 5 /* FORWARD_LEFT */ && dir <= 7 /* BACKWARD_LEFT */) {
        return -1;
    }
    return 0;
}
// 'bx' is what direction forward is, 'by' is what direction 'right' is
function createDirectionTable(board, backrows, bx, by) {
    function getByXY(x, y) {
        if (x < 0 || x >= exports.BOARD_WIDTH || y < -1 || y > exports.BOARD_HEIGHT) {
            return null; // Out-of-bounds
        }
        if (y === -1) {
            return backrows[0][x];
        }
        else if (y === exports.BOARD_HEIGHT) {
            return backrows[1][x];
        }
        else {
            return board[y][x];
        }
    }
    function createDirectionVector(x, y) {
        var vector = [];
        for (var dir = 0; dir <= 7; dir++) {
            var dx = dirToDx(dir) * bx, dy = dirToDy(dir) * by;
            vector.push(getByXY(x + dx, y + dy));
        }
        return vector;
    }
    var grid = [];
    // Include two extra rows for the backrow objects:
    for (var y = -1; y <= exports.BOARD_HEIGHT; y++) {
        var row = [];
        for (var x = 0; x < exports.BOARD_WIDTH; x++) {
            row.push(createDirectionVector(x, y));
        }
        grid.push(row);
    }
    return grid;
}
function createPlayer(name, board, backrows, playerId, deck) {
    var orient = (playerId === 0 ? -1 : +1);
    return { name: name, playerId: playerId, hand: [], deck: deck, triggers: [],
        directionTable: createDirectionTable(board, backrows, orient, orient),
        soul: exports.BEGINNING_SOUL_POINTS,
        miracle: exports.MIRACLE_PER_TURN,
        gold: exports.GOLD_PER_TURN
    };
}
exports.createPlayer = createPlayer;
function newBackRow(playerId) {
    var backrow = [];
    var y = playerId === 0 ? -1 : exports.BOARD_HEIGHT;
    for (var x = 0; x < exports.BOARD_WIDTH; x++) {
        var temple = null;
        if (x === exports.TEMPLE_LANE1 || x === exports.TEMPLE_LANE2) {
            console.log("Created temple");
            temple = { wasAttackedThisTurn: false, playerId: playerId, traits: 0 };
        }
        backrow.push(newSquare(x, y, temple));
    }
    return backrow;
}
exports.newBackRow = newBackRow;
function forRange(n, f) {
    if (typeof n === 'object')
        n = n.length;
    var ret = [];
    for (var i = 0; i < n; i++) {
        ret.push(f(i));
    }
    return ret;
}
exports.forRange = forRange;
function newGameSessionFromYamlFormat(yamlCardData) {
    var cardId = 0, cardDataMap = {};
    for (var _i = 0, _a = values(yamlCardData); _i < _a.length; _i++) {
        var data = _a[_i];
        cardDataMap[data.name] = yamlFormatToInternalFormat(cardId++, data);
    }
    return { cardData: values(cardDataMap), cardDataMap: cardDataMap, localPlayerId: 0, gameState: newGameState(), previousGameStates: [] };
}
exports.newGameSessionFromYamlFormat = newGameSessionFromYamlFormat;
function setGameState(gameSession, gameState) {
    gameSession.gameState = gameState;
    saveGameSessionState(gameSession);
}
exports.setGameState = setGameState;
function gameSessionHasStarted(gameSession) {
    for (var _i = 0, _a = gameSession.gameState.players; _i < _a.length; _i++) {
        var deck = _a[_i].deck;
        if (deck.length > 0) {
            return true;
        }
    }
    return false;
}
exports.gameSessionHasStarted = gameSessionHasStarted;
function gameSessionStart(gameSession, playerId, playerNames, cardNameDecks) {
    var decks = cardNameDecks.map(function (names) {
        return shuffle(names.map(function (name) { return gameSession.cardDataMap[name]; }).filter(function (s) { return s != null; }));
    });
    gameSession.localPlayerId = playerId;
    for (var i = 0; i < gameSession.gameState.players.length; i++) {
        var player = gameSession.gameState.players[i];
        var deck = decks[i];
        var name_1 = playerNames[i];
        player.deck = deepClone(deck);
        player.name = name_1;
    }
    saveGameSessionState(gameSession);
}
exports.gameSessionStart = gameSessionStart;
function saveGameSessionState(_a) {
    var previousGameStates = _a.previousGameStates, gameState = _a.gameState;
    previousGameStates.push(deepClone(gameState));
}
exports.saveGameSessionState = saveGameSessionState;
function newGameState() {
    var board = [];
    for (var y = 0; y < exports.BOARD_HEIGHT; y++) {
        var row = [];
        for (var x = 0; x < exports.BOARD_WIDTH; x++) {
            var unit = newSquare(x, y);
            row.push(unit);
        }
        board.push(row);
    }
    var backrows = [0, 1].map(function (playerId) { return newBackRow(playerId); });
    var players = [0, 1].map(function (playerId) { return createPlayer('', board, backrows, playerId, []); });
    return { flags: 0, actionLog: [], nextInstanceId: 1, playerTurn: 0, resolvingEffect: null, activeEffects: [], players: players, board: board, backrows: backrows, playSound: function (_) { }, uiMessage: function (object, msg) {
            var remaining = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                remaining[_i - 2] = arguments[_i];
            }
        } };
}
exports.newGameState = newGameState;
// Transactional moves:
function cloneState(_a) {
    var playerTurn = _a.playerTurn, players = _a.players, backrows = _a.backrows, board = _a.board;
    return { playerTurn: playerTurn, players: deepClone(players), backrows: deepClone(backrows), board: deepClone(board) };
}
exports.cloneState = cloneState;
function revertState(dst, src) {
    var players = dst.players, backrows = dst.backrows, board = dst.board;
    dst.playerTurn = src.playerTurn;
    deepCopy(players, src.players);
    deepCopy(backrows, src.backrows);
    deepCopy(board, src.board);
}
exports.revertState = revertState;
function canDrawCard(state, player) {
    return (player.deck.length >= 1);
}
exports.canDrawCard = canDrawCard;
function drawCard(state, player) {
    assert(canDrawCard(state, player));
    player.hand.push(player.deck.pop());
}
exports.drawCard = drawCard;
function doUnitMove(state, unit1, unit2) {
    var x = unit2.x, y = unit2.y;
    deepCopy(unit2, unit1);
    unitReset(unit1);
    unit2.x = x;
    unit2.y = y;
    unit2.moveActionsDone++;
}
exports.doUnitMove = doUnitMove;
function hasTrait(obj, trait) {
    return !!(obj.traits & trait);
}
exports.hasTrait = hasTrait;
function doUnitAttack(state, unit1, unit2) {
    doUnitDamage(state, unit2);
    if (!hasTrait(unit1, 64 /* Initiative */)) {
        doUnitDamage(state, unit1);
    }
    unit1.attackActionsDone++;
}
exports.doUnitAttack = doUnitAttack;
// Unit movement:
function gameTurnStart(state) {
    for (var _i = 0, _a = state.board; _i < _a.length; _i++) {
        var row = _a[_i];
        for (var _b = 0; _b < row.length; _b++) {
            var unit = row[_b];
            unitOnTurnStart(state, unit);
        }
    }
}
exports.gameTurnStart = gameTurnStart;
function gameTurnEnd(state) {
    state.playerTurn = state.playerTurn ? 0 : 1;
}
exports.gameTurnEnd = gameTurnEnd;
function unitOnTurnStart(state, unit) {
    unit.moveActionsDone = 0;
    unit.attackActionsDone = 0;
    if (hasTrait(unit, 8192 /* Reusable */)) {
        unit.health = Math.max(unit.health, unitMaxHealth(state, unit));
    }
}
exports.unitOnTurnStart = unitOnTurnStart;
function unitNextInDirection(state, player, unit, direction) {
    return player.directionTable[unit.y + 1][unit.x][direction];
}
exports.unitNextInDirection = unitNextInDirection;
function getActiveUnits(state) {
    var active = [];
    for (var _i = 0, _a = state.backrows.concat(state.board); _i < _a.length; _i++) {
        var row = _a[_i];
        for (var _b = 0; _b < row.length; _b++) {
            var unit = row[_b];
            if (unitIsActive(state, unit)) {
                active.push(unit);
            }
        }
    }
    return active;
}
exports.getActiveUnits = getActiveUnits;
function unitIsActive(state, unit) {
    return !!unit.card;
}
exports.unitIsActive = unitIsActive;
function unitIsHostileToUnit(state, attacker, defender) {
    return (defender.card && attacker.playerId !== defender.playerId);
}
exports.unitIsHostileToUnit = unitIsHostileToUnit;
function unitCanMove(state, unit) {
    if (unit.traits & 4 /* Trapped */) {
        return false;
    }
    else if (!unit.moveActionsDone) {
        if (unit.attackActionsDone) {
            return !!(unit.traits & 1 /* HitAndRun */);
        }
        else {
            return true;
        }
    }
}
exports.unitCanMove = unitCanMove;
// Transform to format expected by the from-yaml card printer:
function internalFormatToYamlFormat(card) {
    var name = card.name, Miracle = card.miracleCost, Gold = card.goldCost, AnyCost = card.anyCost, Description = card.description, Traits = card.traitsText, Image = card.imageFileName;
    if (card.unitData) {
        var _a = card.unitData, Health = _a.health, Movement = _a.movement, Range = _a.range;
    }
    return { name: name, Miracle: Miracle, Gold: Gold, AnyCost: AnyCost, Description: Description, Traits: Traits, Image: Image, Health: Health, Movement: Movement, Range: Range };
}
exports.internalFormatToYamlFormat = internalFormatToYamlFormat;
function yamlFormatToCardTraits(desc, traitNames) {
    var computedTraitNames = (traitNames || []).concat((desc || '').split('.')).map(function (s) { return s.trim().toLowerCase(); });
    var traits = 0;
    var has = function (s) { return (computedTraitNames.indexOf(s) > -1); };
    function addIf(match, flag) {
        if (has(match.toLowerCase())) {
            traits |= flag;
        }
    }
    addIf('Conjuration', 32768 /* Conjuration */);
    addIf('Blessing', 16384 /* Blessing */);
    addIf('Hit&Run', 1 /* HitAndRun */);
    addIf('Twinstrike', 16 /* Twinstrike */);
    addIf('Lanestrike', 32 /* Lanestrike */);
    addIf('Initiative', 64 /* Initiative */);
    addIf('Aegis', 128 /* Aegis */);
    addIf('Returning', 256 /* Returning */);
    addIf('Easysummon', 512 /* Easysummon */);
    addIf('Structure', 1024 /* Structure */);
    addIf('Token', 4096 /* Token */);
    addIf('Reusable', 8192 /* Reusable */);
    addIf('Ritual', 65536 /* Ritual */);
    addIf('Trigger', 131072 /* Trigger */);
    addIf('Salumite', 262144 /* Salumite */);
    addIf('Skullcrusher', 524288 /* Skullcrusher */);
    addIf('Warrior', 1048576 /* Warrior */);
    addIf('Beast', 4194304 /* Beast */);
    addIf('Priest', 2097152 /* Priest */);
    addIf('Conjuror', 8388608 /* Conjuror */);
    addIf('Bael\'Kai', 16777216 /* BaelKai */);
    addIf('Leader', 67108864 /* Leader */);
    addIf('Controller', 134217728 /* Controller */);
    return traits;
}
exports.yamlFormatToCardTraits = yamlFormatToCardTraits;
function yamlFormatToInternalFormat(cardId, _a) {
    var name = _a.name, Miracle = _a.Miracle, AnyCost = _a.AnyCost, Gold = _a.Gold, Description = _a.Description, Traits = _a.Traits, Image = _a.Image, Health = _a.Health, Movement = _a.Movement, Range = _a.Range;
    var traits = yamlFormatToCardTraits(Description, Traits);
    if (Range || Movement || Health) {
        var unitData = { health: Health, movement: Movement, range: Range, traits: traits };
    }
    // We don't set unit.card; that is set during placement and would cause a data cycle here.
    return { name: name, cardId: cardId, unitData: unitData, miracleCost: Miracle, anyCost: AnyCost, goldCost: Gold, description: Description, traitsText: Traits, imageFileName: Image, traits: traits };
}
exports.yamlFormatToInternalFormat = yamlFormatToInternalFormat;
function unitCanAttack(state, unit) {
    var hitQuota = unit.attackActionsDone >= (unit.traits & 16 /* Twinstrike */ ? 2 : 1);
    if (unit.traits & 4 /* Trapped */) {
        return false;
    }
    else if (!hitQuota) {
        if (unit.moveActionsDone) {
            return !!(unit.traits & 2 /* Charge */);
        }
        else {
            return true;
        }
    }
}
exports.unitCanAttack = unitCanAttack;
function unitMovement(state, unit) {
    return unit.movement;
}
exports.unitMovement = unitMovement;
function unitRange(state, unit) {
    return unit.range;
}
exports.unitRange = unitRange;
function unitMaxHealth(state, unit) {
    return unit.card.unitData.health;
}
exports.unitMaxHealth = unitMaxHealth;
function unitHealth(state, unit) {
    return unit.health;
}
exports.unitHealth = unitHealth;
function squareIsOnBoard(state, unit) {
    return unit.y >= 0 && unit.y < exports.BOARD_HEIGHT;
}
exports.squareIsOnBoard = squareIsOnBoard;
function squareIsFree(state, unit) {
    return !unitIsActive(state, unit) && squareIsOnBoard(state, unit);
}
exports.squareIsFree = squareIsFree;
function playerAddHandCard(player, card) {
    player.hand.push(deepClone(card));
}
exports.playerAddHandCard = playerAddHandCard;
function playerAddTrigger(player, card) {
    player.triggers.push(deepClone(card));
}
exports.playerAddTrigger = playerAddTrigger;
function getCardOwner(gameState, card) {
    for (var _i = 0, _a = gameState.players; _i < _a.length; _i++) {
        var player = _a[_i];
        if (player.hand.indexOf(card) > -1)
            return player;
        if (player.triggers.indexOf(card) > -1)
            return player;
    }
    return null;
}
exports.getCardOwner = getCardOwner;
function removeDeckCard(gameState, card) {
    for (var _i = 0, _a = gameState.players; _i < _a.length; _i++) {
        var deck = _a[_i].deck;
        pull(deck, card);
    }
}
exports.removeDeckCard = removeDeckCard;
function removeHandCard(gameState, card, placeInDeck) {
    if (placeInDeck === void 0) { placeInDeck = false; }
    for (var _i = 0, _a = gameState.players; _i < _a.length; _i++) {
        var _b = _a[_i], hand = _b.hand, deck = _b.deck;
        if (hand.indexOf(card) > -1) {
            pull(hand, card);
            if (placeInDeck) {
                deck.push(card);
                shuffle(deck);
            }
        }
    }
}
exports.removeHandCard = removeHandCard;
function removeTriggerCard(gameState, trigger) {
    for (var _i = 0, _a = gameState.players; _i < _a.length; _i++) {
        var triggers = _a[_i].triggers;
        pull(triggers, trigger);
    }
}
exports.removeTriggerCard = removeTriggerCard;
function canSummonUnitOnSquare(state, player, unit) {
    return unit.card && squareIsOnBoard(state, unit); // TODO too lenient
}
exports.canSummonUnitOnSquare = canSummonUnitOnSquare;
function canPlaceStructureOnSquare(state, player, unit) {
    return unit.card && !unit.temple; // TODO too lenient
}
exports.canPlaceStructureOnSquare = canPlaceStructureOnSquare;
function unitMoveSquares(state, unit, buffer) {
    if (buffer === void 0) { buffer = []; }
    buffer.length = 0;
    if (!unitIsActive(state, unit)) {
        return buffer;
    }
    //    if (!unitCanMove(state, unit)) {
    //        return buffer;
    //    }
    var movement = unitMovement(state, unit);
    for (var direction = 0; direction < 8; direction++) {
        var currentSquare = unit;
        for (var squaresAway = 1; squaresAway <= movement; squaresAway++) {
            currentSquare = unitNextInDirection(state, state.players[unit.playerId], currentSquare, direction);
            if (!currentSquare || !squareIsFree(state, currentSquare)) {
                break;
            }
            buffer.push(currentSquare);
        }
    }
    console.log('squares', buffer);
    return buffer;
}
exports.unitMoveSquares = unitMoveSquares;
function unitAttackSquares(state, unit, buffer) {
    if (buffer === void 0) { buffer = []; }
    buffer.length = 0;
    if (!unitIsActive(state, unit)) {
        return buffer;
    }
    //    if (!unitCanAttack(state, unit)) {
    //        return buffer;
    //    }
    var range = unitRange(state, unit);
    for (var direction = 0; direction < 8; direction++) {
        var currentSquare = unit;
        for (var squaresAway = 1; squaresAway <= range; squaresAway++) {
            currentSquare = unitNextInDirection(state, state.players[unit.playerId], currentSquare, direction);
            if (!currentSquare || !squareIsFree(state, currentSquare)) {
                break;
            }
            buffer.push(currentSquare);
        }
    }
    console.log('squares', buffer);
    return buffer;
}
exports.unitAttackSquares = unitAttackSquares;
