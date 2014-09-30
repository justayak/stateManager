stateManager:
Simple State System

```javascript

// enable/disable logging
state.setLogging(true);

// create a new State named "loading"
var loading = State.Manager.createState("loading");
// Listen to all events
loading.onStart = function(p){
    ...
}
loading.onClose = function(p){
    ...
}
loading.onPause = function(p){
    ...
}
loading.onResume = function(p){
    ...
}

// create a new State named "game"
var game = State.Manager.createState("game");

game.onStart = function(p){
    console.log(p); // prints: { x: "hallo", y: "welt" }
}

StateManager.setState("game", { x: "hallo", y: "welt" });

// Substates

var subgame = game.createSubstate("subgame");
// Same events..
subgame.onStart = function(p){
    setTimeout(function(){
        subgame.close(); // closes this sub state, resumes the parent state
    },100);
}
subgame.onClose = function(p){
    ...
}
subgame.onPause = function(p){
    ...
}
subgame.onResume = function(p){
    ...
}
game.setSubstate("subgame"); // pauses the parent state, opens sub state

```
