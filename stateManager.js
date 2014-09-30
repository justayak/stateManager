/**
 * Created by Julian on 9/30/2014.
 */
window.state = function(){

    var isLogActive = true;

    /**
     * Log data
     * @param msg
     */
    function log(msg) {
        if (isLogActive) {
            console.log("[stateManager][" + new Date().toISOString().substring(12) + "]" + msg);
        }
    }

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // CODE START
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    var _states = {};
    var _currentState = null;

    function State(name) {
        this._states = [];
        this._currentSubstate = null;
        this._isPaused = false;
        this.name;
        this.onPause = this.onResume = this.onStart = this.onClose = null;
    };

    State.prototype.createSubstate = function(name) {
        if (name in this._states) {
            log("Substate {" + name + "} is already member of {" + this.name + "} -> Overwrite");
        }
        log("Create Substate {" + name + "} in State {" + this.name + "}");
        var state = new State(name);
        return state;
    };

    /**
     * Set the current substate and closes any other substate that might
     * be running inside this state
     * @param name
     * @param p
     */
    State.prototype.setSubstate = function(name, p) {
        log("Trying to open Substate {" + name + "} in State {" + this.name + "}");
        if (name in this._states) {
            if (!this._isPaused) {
                this.pause(p);
            }
            var newState = this._states[name];
            if (this._currentSubstate !== null) {
                this._currentSubstate.close(p);
            }
            newState.open(p);
            this._currentSubstate = newState;
        } else {
            log("Could not find Substate {" + name + "} in State {" + this.name + "}");
        }
    };

    State.prototype.closeSubstate = function(p){
        log("Trying to close Substate {" + name + "} in State {" + this.name + "}");
        if (this._currentSubstate !== null){
            this._currentSubstate.close(p);
            this.resume(p);
        } else {
            log("No Substate is running in in State {" + this.name + "}");
        }
    };

    /**
     * Startup state
     */
    State.prototype.start = function(p){
        if (this.onStart !== null){
            this.onStart.call(this,p);
        }
    };

    /**
     * Askes the state to pause
     */
    State.prototype.pause = function(p){
        this._isPaused = true;
        if (this.onPause !== null) {
            this.onPause.call(this,p);
        }
    };

    /**
     * resumes program from pause
     */
    State.prototype.resume = function(p){
        this._isPaused = true;
        if (this.onResume !== null) {
            this.onResume.call(this,p);
        }
    };

    /**
     * Close state
     */
    State.prototype.close = function(p){
        if (this.onClose !== null) {
            this.onClose.call(this,p);
        }
    };

    return {
        setLogging: function(logging){
            isLogActive = logging;
        },
        Manager : {
            /**
             * Creates a new instance of state under a certain name
             * @param name {String}
             * @returns {state.State}
             */
            createState: function(name) {
                if (name in _states) {
                    log("Overwriting State {" + name + "}");
                }
                var state = new State(name);
                _states[name] = state;
                return state;
            },

            /**
             *
             * @param name {String}
             */
            setState: function(name) {
                if (name in _states) {
                    if (_currentState !== null) {
                        _currentState.close();
                    }
                    _currentState = _states[name];
                    _currentState.start();
                } else {
                    log("Could not find State {" + name + "}");
                }
            }
        },
        State: State
    };
}();