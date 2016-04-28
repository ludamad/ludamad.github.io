var React = require("react");
var ReactDOM = require("react-dom");
var ResourceCountRaw = require("./generated/resource-count").ReactSvg;
var CardUnitMini = require("./generated/card-unit2").ReactSvg;
var CardSpellMini = require("./generated/card-spell2").ReactSvg;
var CardStructureMini = require("./generated/card-structure2").ReactSvg;
var CardUnit = require("./generated/card-unit").ReactSvg;
var CardBack = require("./generated/card-back").ReactSvg;
var CardSpell = require("./generated/card-spell").ReactSvg;
var CardStructure = require("./generated/card-structure").ReactSvg;
var orBar = function (s) { return (s == null ? "-" : s); };
var orOne = function (s) { return (s == null ? 1 : s); };
var getGold = function (g, m, a, d) {
    if (g)
        return g;
    if (m)
        return " ";
    if (a)
        return "        Pay " + a;
    if (d.indexOf("(Discard 1 to play) ") > -1) {
        return "        Discard 1";
    }
    return "   Free";
};
function ResourceCount(_a) {
    var gold = _a.gold, miracle = _a.miracle, soul = _a.soul, onClick = _a.onClick;
    return React.createElement("div", {"onContextMenu": onClick, "onClick": onClick}, " ", React.createElement(ResourceCountRaw, {"GOLD": gold, "MANA": miracle, "HEALTH": soul}), " ");
}
exports.ResourceCount = ResourceCount;
exports.Card = React.createClass({
    componentDidMount: function () {
        if (!this.props.mini) {
            d3plus.textwrap().container(d3.select(ReactDOM.findDOMNode(this.refs.card).querySelector('.wrap'))).draw();
        }
    },
    render: function () {
        var _a = this.props, card = _a.card, mini = _a.mini, cardBack = _a.cardBack, outline = _a.outline, transform = _a.transform, className = _a.className, position = _a.position;
        if (typeof card.Range === "undefined") {
            var CardType = mini ? CardSpellMini : CardSpell;
        }
        else if (card.Traits && card.Traits.indexOf('Structure') > -1) {
            var CardType = mini ? CardStructureMini : CardStructure;
        }
        else {
            var CardType = mini ? CardUnitMini : CardUnit;
        }
        if (cardBack) {
            CardType = CardBack;
        }
        var traits = (card.Traits || []).filter(function (s) { return s !== 'Structure'; });
        var cardObject = React.createElement(CardType, {"ref": "card", "NAME": card.name, "GOLD": getGold(card.Gold, card.Miracle, card.AnyCost, card.Description), "COLOURLESS": card.AnyCost || ' ', "MANA": card.Miracle || " ", "USE_MANA": !!card.Miracle, "USE_GOLD": !!card.Gold, "TYPE": (this.props.amount || "") + " " + traits.join("/"), "DESCRIPTION": card.Description.replace("(Discard 1 to play) ", ""), "HEALTH": orBar(card.Health), "IMAGE_FILE": card.Image || "http://vignette4.wikia.nocookie.net/assassinscreed/images/a/af/Question_mark.png/revision/latest/scale-to-width-down/380?cb=20121118055707", "MOVEMENT": orBar(card.Movement), "RANGE": orOne(card.Range)});
        return React.createElement("div", {"className": className, "style": { position: position, width: mini ? "154.5px" : "270px", outline: outline, height: mini ? "154.5px" : "260px", display: "inline-block", overflow: "visible", transform: transform }, "onContextMenu": this.props.onClick, "onClick": this.props.onClick}, " ", cardObject, " ");
    }
});
