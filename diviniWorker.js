importScripts('divinibot.js');
importScripts('comlink.js');
let AI = Module;
let initialMark;

class Engine {
    startGameYaml(yamlMissionSource) {
        AI.resetStateFromHistoryMark(initialMark);
        AI.initGameYaml(yamlMissionSource);
    }
    startGameJson(jsonMissionSource) {
        AI.resetStateFromHistoryMark(initialMark);
        AI.initGameYaml(jsonMissionSource);
    }
    getStateHistoryMark() {
        return AI.getStateHistoryMark();
    }
    reset() {
        return this.resetStateFromHistoryMark(initialMark);
    }
    resetStateFromHistoryMark(mark) {
        return AI.resetStateFromHistoryMark(mark);
    }
    initGameData(yamlCardSource){
        AI.initGameData(yamlCardSource);
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
