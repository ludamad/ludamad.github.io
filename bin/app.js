var React = require("react");
var ReactDOM = require("react-dom");
var Card = require("./card").Card;
var fs = require("fs");
var $ = require("jquery");
var _a = require("lodash"), reduce = _a.reduce, find = _a.find, every = _a.every;
var Textarea = require('react-textarea-autosize');
var gv = require('./game-react-ui/GameView');
var react_utils_1 = require('./game-react-ui/react-utils');
function remove(arr, obj) {
    arr.splice(arr.indexOf(obj), 1);
}
function uniqueCardNames(cards) {
    var nameMap = {};
    for (var _i = 0; _i < cards.length; _i++) {
        var name_1 = cards[_i];
        nameMap[name_1] = true;
    }
    return Object.keys(nameMap);
}
var toggleButtons = function (_a) {
    var screen = _a.screen, setScreen = _a.setScreen;
    return (React.createElement("div", null, ['Build', 'Deck', 'Play', 'Edit'].map(function (s) {
        return React.createElement("button", {"onClick": function () { return setScreen(s.toLowerCase()); }, "type": "button", "disabled": s.toLowerCase() === screen, "class": "toggle btn btn-default btn-xs pull-right"}, s);
    })));
};
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}
function getUrlParameter(name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [, ""])[1].replace(/\+/g, '%20')) || null;
}
var defaultDeck = [];
var stateHistory = [];
var App = React.createClass({
    getInitialState: function () {
        var state = { opponentsDeck: [], unitDeck: [], unitUndrawn: [], discard: [], hand: [], undrawnCards: null, screen: getUrlParameter("mode") || "play", lastSaved: null, cards: getUrlParameter("deck") ? getUrlParameter("deck").split('\n') : defaultDeck, prevChangedCards: [], prevCardData: [],
            editorCardData: [], cardData: this.parseCards(this.props.initialYaml), searchTerm: getUrlParameter('search-term') || ".*", selection: [] };
        if (state.screen === 'play') {
            state.undrawnCards = shuffle(state.cards.filter(function (x) { return state.cardData[x] != null; }));
            state.unitUndrawn = shuffle(state.unitDeck.filter(function (x) { return state.cardData[x] != null; }));
            stateHistory.push(JSON.stringify(state));
        }
        return state;
    },
    renderBoardControl: function () {
        var _this = this;
        var action = this.state.action;
        var makeIt = function (name) {
            return function () { _this.state.action = name; _this.update(); };
        };
        var button = function (name) { return React.createElement("button", {"onClick": makeIt(name)}, " ", name, " "); };
        return React.createElement("div", null, "You are currenting doing a ", action, " action on-click.", button("To Discard"), button("To Hand"), button("Specific Card to Hand"), button("First with Trait to Hand"));
    },
    parseCards: function (yaml) {
        try {
            var cardData = jsyaml.safeLoad(yaml);
            for (var _i = 0, _a = Object.keys(cardData); _i < _a.length; _i++) {
                var cardName = _a[_i];
                cardData[cardName].name = cardName;
                cardData[cardName].Miracle = cardData[cardName].Miracle || 0;
                cardData[cardName].Gold = cardData[cardName].Gold || 0;
                cardData[cardName].AnyCost = cardData[cardName].AnyCost || 0;
            }
            return cardData;
        }
        catch (err) {
            return {};
        }
    },
    actualCards: function () {
        var _this = this;
        return this.state.cards.filter(function (name) { return _this.state.cardData[name] != null; });
    },
    uniqueCards: function () {
        return uniqueCardNames(this.actualCards());
    },
    changedCards: function () {
        var changedCards = [];
        var _a = this.state, prevCardData = _a.prevCardData, cardData = _a.cardData;
        for (var _i = 0, _b = Object.keys(cardData); _i < _b.length; _i++) {
            var name_2 = _b[_i];
            if (prevCardData[name_2] == null) {
                changedCards.push(name_2);
            }
            else if (JSON.stringify(prevCardData[name_2]) !== JSON.stringify(cardData[name_2])) {
                changedCards.push(name_2);
            }
        }
        return changedCards;
    },
    save: function () {
        function save(yaml) {
            if (fs.writeFileSync) {
                fs.writeFileSync("./cards.yaml", yaml);
            }
            else {
                var blob = new Blob([yaml], { type: "text/plain;charset=utf-8;" });
                saveAs(blob, "cards.yaml");
            }
        }
        var data = {};
        for (var _i = 0, _a = Object.keys(this.state.cardData).sort(); _i < _a.length; _i++) {
            var key = _a[_i];
            data[key] = JSON.parse(JSON.stringify(this.state.cardData[key]));
            delete data[key].name;
        }
        var yaml = jsyaml.safeDump(data, { flowLevel: 2 });
        save(yaml);
        this.state.lastSaved = new Date();
        this.update();
    },
    componentDidMount: function () {
        var _this = this;
        var isCtrl = false;
        document.onkeyup = function (e) { if (e.keyCode === 17)
            isCtrl = false; };
        document.onkeydown = function (e) {
            if (e.keyCode == 17)
                isCtrl = true;
            if (e.keyCode == 83 && isCtrl && Object.keys(_this.state.cardData).length) {
                _this.save();
                return true;
            }
        };
    },
    undo: function () {
        if (stateHistory.length >= 1) {
            stateHistory.pop(); // throw current state away
            this.setState(JSON.parse(stateHistory[stateHistory.length - 1]));
        }
    },
    update: function () {
        stateHistory.push(JSON.stringify(this.state));
        this.forceUpdate();
    },
    updateYaml: function (yaml) {
        var changedCards = this.changedCards();
        if (changedCards.length >= 1) {
            if (Object.keys(this.state.prevChangedCards).join(",") !== Object.keys(changedCards).join(",")) {
                this.state.prevChangedCards = changedCards;
            }
        }
        this.state.prevCardData = this.state.cardData;
        this.state.cardData = this.parseCards(yaml);
        this.forceUpdate();
    },
    getCardSelection: function () {
        return Object.keys(this.state.cardData).filter(this.matchesSearchTerm).sort();
    },
    cardDataToYaml: function (cardData) {
        return jsyaml.safeDump(cardData, { flowLevel: 2 });
    },
    matchesSearchTerm: function (name) {
        var term = this.state.searchTerm.toLowerCase().trim();
        if (term === "") {
            return true;
        }
        var regex = new RegExp(term.replace(":spell", "").replace(":unit", "").replace(":deck").trim());
        var card = this.state.cardData[name];
        card.Cost = card.Gold + card.Miracle + card.AnyCost;
        var matched = false;
        var otherMatches = {};
        for (var i = 0; i < 10; i++) {
            for (var _i = 0, _a = ['Gold', 'Miracle', 'Cost', 'Health']; _i < _a.length; _i++) {
                var attr = _a[_i];
                if (term.indexOf(attr.toLowerCase() + " " + i) > -1) {
                    otherMatches[attr] = card[attr] == i;
                }
                if (term.indexOf(attr.toLowerCase() + " < " + i) > -1) {
                    otherMatches[attr] = card[attr] < i;
                }
                if (term.indexOf(attr.toLowerCase() + " > " + i) > -1) {
                    otherMatches[attr] = card[attr] > i;
                }
                if (term.indexOf(attr.toLowerCase() + " >= " + i) > -1) {
                    otherMatches[attr] = card[attr] >= i;
                }
                if (term.indexOf(attr.toLowerCase() + " <= " + i) > -1) {
                    otherMatches[attr] = card[attr] <= i;
                }
            }
        }
        delete card.Cost;
        if (name.toLowerCase().match(regex) || card.Description.toLowerCase().match(regex)) {
            matched = true;
        }
        if (term.indexOf(":spell") > -1) {
            otherMatches.Spell = card.Range == null;
        }
        if (term.indexOf(":unit") > -1) {
            otherMatches.Unit = card.Range != null;
        }
        if (term.indexOf(":deck") > -1) {
            otherMatches.Deck = this.state.cards.indexOf(card.name) > 0;
        }
        if (!matched) {
            for (var _b = 0, _c = card.Traits || []; _b < _c.length; _b++) {
                var trait = _c[_b];
                if (term.indexOf(trait) > -1) {
                    matched = true;
                    break;
                }
            }
        }
        if (matched || find(otherMatches, function (s) { return s; })) {
            if (every(otherMatches, function (v) { return v !== false; })) {
                return true;
            }
        }
        return false;
    },
    updateSearchTerm: function (term) {
        var _this = this;
        this.state.searchTerm = term;
        this.state.selection = this.getCardSelection();
        if (this.iframe) {
            var iframeRaw = ReactDOM.findDOMNode(this.iframe);
            var cardData = reduce(this.state.selection, function (obj, k) {
                obj[k] = JSON.parse(JSON.stringify(_this.state.cardData[k]));
                delete obj[k].name;
                return obj;
            }, {});
            iframeRaw.contentWindow.postMessage(this.cardDataToYaml(cardData), '*');
        }
        this.forceUpdate();
    },
    updateCardDataParts: function (yaml) {
        var updatedCards = this.parseCards(yaml);
        var removedCards = this.state.selection.filter(function (s) { return !updatedCards[s]; });
        for (var _i = 0, _a = Object.keys(updatedCards); _i < _a.length; _i++) {
            var card = _a[_i];
            this.state.cardData[card] = updatedCards[card];
            this.state.cardData[card].name = card;
        }
        for (var _b = 0; _b < removedCards.length; _b++) {
            var removedCard = removedCards[_b];
            delete this.state.cardData[removedCard];
        }
        this.state.selection = Object.keys(updatedCards);
        this.state.editorCardData = updatedCards;
        this.forceUpdate();
    },
    count: function (n) {
        var count = 0;
        for (var _i = 0, _a = this.actualCards(); _i < _a.length; _i++) {
            var name_3 = _a[_i];
            if (n === name_3)
                count++;
        }
        return count;
    },
    position: function (n) {
        var index = this.uniqueCards().indexOf(n);
        if (index === -1)
            return "";
        return "#" + (index + 1) + " ";
    },
    setScreen: function (screen) {
        var _this = this;
        if ((this.state.screen = screen) == "play") {
            this.state.undrawnCards = shuffle(this.state.cards.filter(function (x) { return _this.state.cardData[x] != null; }));
            this.state.unitUndrawn = shuffle(this.state.unitDeck.filter(function (x) { return _this.state.cardData[x] != null; }));
            this.update();
        }
        else {
            this.forceUpdate();
        }
    },
    render: function () {
        var _this = this;
        var renderLogic = {
            build: function () {
                return _this.renderCommon({ matchingNames: Object.keys(_this.state.cardData).filter(_this.matchesSearchTerm) });
            },
            deck: function () {
                return _this.renderCommon({ matchingNames: _this.uniqueCards().filter(_this.matchesSearchTerm) });
            },
            play: function () {
                return _this.renderCommon({ matchingNames: _this.state.hand });
            },
            edit: function () {
                var _a = _this.state, selection = _a.selection, cardData = _a.cardData, lastSaved = _a.lastSaved;
                return React.createElement("div", null, React.createElement("div", null, lastSaved ? "Last time saved to cards.yaml: " + lastSaved : ""), _this.renderCommon({ matchingNames: Object.keys(_this.state.editorCardData) }));
            }
        };
        var displayIframe = (this.state.screen === "edit") ? "inline-block" : "none";
        var displaySearchBar = (this.state.screen !== "play") ? "inline-block" : "none";
        var iFrameGetRef = function (iframe) {
            _this.iframe = iframe;
            var jnode = $(ReactDOM.findDOMNode(iframe));
            jnode.load(function (_) {
                var iframeRaw = ReactDOM.findDOMNode(iframe);
                iframeRaw.contentWindow.postMessage('', '*');
                onMessage(function (yaml) { return _this.updateCardDataParts(yaml); });
                _this.searchValue = '';
                _this.updateSearchTerm(_this.searchValue);
            });
        };
        var iframe = React.createElement("iframe", {"ref": iFrameGetRef, "key": "iframe", "frameBorder": "0", "src": "iframe.html", "style": { width: "1500px", height: "440px", display: displayIframe }, "scrolling": "no"});
        var searchValues = {};
        var actionButton = function (hasSearch, actionText, action) {
            var components = [];
            components.push(React.createElement("button", {"onClick": function () { return action(searchValues[actionText]); }}, actionText));
            if (hasSearch) {
                components.push(React.createElement("input", {"type": "text", "value": searchValues[actionText], "style": { display: displaySearchBar }, "onChange": function (_a) {
                    var value = _a.target.value;
                    searchValues[actionText] = value;
                }}));
            }
            return React.createElement("div", null, " ", components, " ");
        };
        //            {this.renderBoardControl()}
        return React.createElement("div", null, iframe, React.createElement("div", {"style": { display: displaySearchBar }}, "Searchbar, use input like eg ':unit gold >= 2 miracle 0', 'miracle 1', 'salumite', 'skullcrusher', 'priest', 'plumbus', etc:"), React.createElement("div", null, React.createElement("input", {"type": "text", "key": "searchbar", "style": { display: displaySearchBar }, "onChange": function (_a) {
            var value = _a.target.value;
            _this.searchValue = value;
        }}), React.createElement("button", {"style": { display: displaySearchBar }, "onClick": function () {
            if (_this.searchValue !== undefined) {
                _this.updateSearchTerm(_this.searchValue);
            }
        }, "type": "button", "class": "toggle btn btn-default btn-xs pull-right"}, "Apply Search"), React.createElement("button", {"style": { display: displaySearchBar }, "onClick": function () {
            _this.save();
        }, "type": "button", "class": "toggle btn btn-default btn-xs pull-right"}, "Save edited cards to file")), renderLogic[this.state.screen]());
    },
    renderCommon: function (_a) {
        var _this = this;
        var matchingNames = _a.matchingNames;
        matchingNames.sort();
        var i = 1;
        function matches(name) {
            return matchingNames.indexOf(name) >= 0;
        }
        var cardNames = Object.keys(this.state.cardData);
        var key = function (name) {
            if (_this.state.screen !== "play")
                return "card-" + name + "-" + (_this.state.cardData[name].Description || "<nodesc>");
            return "card-" + name + "-" + (_this.state.cardData[name].Description || "<nodesc>") + "-" + i++;
        };
        var onClick = function (name) { return function (e) {
            if (_this.state.screen === "build" || _this.state.screen === "edit") {
                e.preventDefault();
                if (_this.count(name) == 2) {
                    remove(_this.state.cards, name);
                    remove(_this.state.cards, name);
                }
                else {
                    _this.state.cards.push(name);
                }
                _this.state.cards.sort();
                _this.forceUpdate();
            }
            else if (_this.state.screen === "play") {
                _this.state.hand.splice(_this.state.hand.indexOf(name), 1);
                _this.state.discard.push(name);
                _this.update();
            }
        }; };
        var totalGP = 0, totalMP = 0, totalAnyCost = 0;
        for (var _i = 0, _b = this.state.cards; _i < _b.length; _i++) {
            var cardName = _b[_i];
            var card = this.state.cardData[cardName];
            if (!card) {
                continue;
            }
            if (card.Miracle && typeof card.Miracle === "number") {
                totalMP += card.Miracle;
            }
            if (card.AnyCost && typeof card.AnyCost === "number") {
                totalAnyCost += card.AnyCost;
            }
            if (card.Gold && typeof card.Gold === "number") {
                totalGP += card.Gold;
            }
        }
        return (React.createElement("div", null, React.createElement("div", {"style": { display: this.state.screen === "play" ? "none" : "inline-block" }}, React.createElement("div", null, "You are currently composing your deck. You have ", this.state.cards.length, "/40 cards." + ' ' + "Your deck has a total cost of ", totalGP, " GP, ", totalMP, " MP, ", totalAnyCost, " Any, for a total of ", totalGP + totalMP + totalAnyCost, "." + ' ' + "You are recommended to have a total cost of at least 80."), React.createElement("div", null, " Shareable link to your deck: "), React.createElement("div", null, " ", React.createElement(Textarea, {"key": "decklink", "value": "http://ludamad.github.io?mode=deck&deck=" + encodeURIComponent(this.state.cards.join('\n')), "style": { width: "800px" }})), React.createElement("div", null, " You can paste here, or select cards below. "), React.createElement("div", null, " ", React.createElement(Textarea, {"key": "deckform", "value": this.state.cards.join('\n'), "style": { width: "400px" }, "onChange": function (_a) {
            var value = _a.target.value;
            _this.state.cards = value.split('\n');
            _this.forceUpdate();
        }}), " ")), toggleButtons({ screen: this.state.screen, setScreen: this.setScreen }), React.createElement("div", null, " ", this.state.screen == "deck" ? "Current deck: " : "Available cards: ", " "), React.createElement("div", {"style": { width: "1200px", height: "100%", display: "inline-block", overflow: "visible" }}, matchingNames.map(function (name) {
            return React.createElement(Card, {"key": key(name), "card": _this.state.cardData[name], "amount": _this.state.screen === 'play' ? '' : "(" + _this.count(name) + ")", "onClick": onClick(name)});
        })), React.createElement("div", null, " ", React.createElement(StableGameView, {"screen": this.state.screen, "yamlCardData": this.state.cardData, "cardNameDeck": this.state.cards}), " ")));
    }
});
// State does not go away if you accidentally press one of the buttons
var StableGameView = react_utils_1.StatefulThis(function (_a) {
    var yamlCardData = _a.yamlCardData, cardNameDeck = _a.cardNameDeck, screen = _a.screen;
    if (screen === 'play') {
        this.state.seenPlay = true;
    }
    if (this.state.seenPlay && Object.keys(yamlCardData).length > 0) {
        var displayGame = screen === "play" ? "inline-block" : "none";
        return (React.createElement("div", {"style": { display: displayGame }}, React.createElement(gv.App, {"yamlCardData": yamlCardData, "cardNameDeck": cardNameDeck})));
    }
    return React.createElement("div", null);
});
function onMessage(callback) {
    var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
    var eventer = window[eventMethod];
    var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";
    eventer(messageEvent, (function (_a) {
        var message = _a.message, data = _a.data;
        return callback(message || data);
    }), false);
}
function onAppRefLoad(appRef) {
    function post(defaultContent) {
        appRef.updateYaml(defaultContent);
    }
    if (fs.readFileSync) {
        post(fs.readFileSync("./cards.yaml").toString());
    }
    else {
        $.ajax({
            url: getUrlParameter('rule-file') || "https://raw.githubusercontent.com/ludamad/card-rules/master/cards.yaml",
            // Set to a default on error:
            error: function (err) { return post("\n        Goblin:\n          Gold: 2\n          Health: 2\n          Attack: 1\n          Movement: 2\n          Range: 1\n          Description: A short and fast goblin.\n          Traits: [Humanoid]\n        "); }
        }).done(post);
    }
}
//let App2 = require("./app2").APP;
//
//ReactDOM.render(<App2/>, document.getElementById("main")
//);
//ReactDOM.render(<bv.App/>, document.getElementById("app-container"));
ReactDOM.render(React.createElement(App, {"ref": function (appRef) { return onAppRefLoad(appRef); }, "initialYaml": ""}), document.getElementById("app-container"));
//ReactDOM.render(<Demo/>, document.getElementById("app-container"));
