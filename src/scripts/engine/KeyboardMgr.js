import {Globals} from "./Globals";


export class KeyboardMgr {
    static _instance = null;


    /**
     * KeyboardMgr class
     * @private
     */
    constructor() {
        this._state = {};
        this.state = {};
        this.keyDown = {};
        this.keyUp = {};
        Globals.engine.addToUpdate(this);
    }


    /**
     * Get the unique instance of KeyboardMgr
     * @returns {KeyboardMgr}
     */
    static get instance() {
        if (KeyboardMgr._instance === null) {
            KeyboardMgr._instance = new KeyboardMgr();
        }
        return KeyboardMgr._instance;
    }


    /**
     * On key down event listener
     * @param {KeyboardEvent} key
     */
    onKeyDown(key) {
        key.preventDefault();
        this.keyDown[key.code] = true;
        this.keyUp[key.code] = false;
        this._state[key.code] = "down";
        if (this.state[key.code] === undefined) {
            this.state[key.code] = "up";
        }
    }


    /**
     * On key up event listener
     * @param {KeyboardEvent} key
     */
    onKeyUp(key) {
        key.preventDefault();
        this.keyDown[key.code] = false;
        this.keyUp[key.code] = true;
        this._state[key.code] = "up";
    }


    /**
     * Update keys states
     * @param {Number} dt
     */
    update(dt) {
        const oldState = this.state;

        for (let key in this._state) {
            const state = this._state[key];
            if (
                (oldState[key] === "up" || oldState[key] === "new_up") &&
                state === "down"
            ) {
                this.state[key] = "new_down";
            } else if(
                (oldState[key] === "down" || oldState[key] === "new_down") &&
                state === "up"
            ) {
                this.state[key] = "new_up";
            } else {
                this.state[key] = this._state[key];
            }
        }
    }
}