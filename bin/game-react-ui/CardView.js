var React = require('react');
var _a = require('lodash'), shuffle = _a.shuffle, range = _a.range, every = _a.every, flatten = _a.flatten;
var gs = require('../game-logic-core/gs');
var card_1 = require('../card');
// Simple transformer to the yaml format of the yaml->svg card component (shared by the card editor).
function CardView(_a) {
    var card = _a.card, mini = _a.mini, onClick = _a.onClick, outline = _a.outline, className = _a.className, transform = _a.transform, position = _a.position;
    var cardTransformed = gs.internalFormatToYamlFormat(card);
    return React.createElement(card_1.Card, {"key": card.name, "className": className, "transform": transform, "position": position, "card": cardTransformed, "mini": mini, "outline": outline, "onClick": onClick});
}
exports.CardView = CardView;
