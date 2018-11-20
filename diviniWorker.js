importScripts('divinibot.js');
importScripts('comlink.js');
let AI = Module;
AI.initGameData();
let initialMark;


class Engine {
    startGame(gameData) {
        AI.resetStateFromHistoryMark(initialMark);
        AI.initGame(gameData);
    }
    getStateHistoryMark() {
        return AI.getStateHistoryMark();
    }
    resetStateFromHistoryMark(mark) {
        return AI.resetStateFromHistoryMark(mark);
    }
    initGameData(){
        AI.initGameData();
        AI.initGame(JSON.stringify({decks: [], squareData: []}));
        initialMark = AI.getStateHistoryMark();
    }
    getStateJson(){
        return AI.getStateJson();
    }
    ascii(){
        return AI.ascii()
    }
    getCardDefJson() {
        return AI.getCardDefJson();
    }
    getActionJson() {
        return AI.getActionJson();
    }
    getAnimationStatesJson() {
        return AI.getAnimationStatesJson();
    }
    getStateHistoryMark() {
        return AI.getStateHistoryMark();
    }
    performActionByIndex(idx) {
        return AI.performActionByIndex(idx);
    }
    setPlayerController(playerId, pc) {
        return AI.setPlayerController(playerId, pc);
    }
    getNextAIAction() {
        return AI.getNextAIAction();
    }
}
Comlink.expose(Engine, self);
