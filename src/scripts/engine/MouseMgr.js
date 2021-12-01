import {Globals} from "./Globals";


export class MouseMgr {
    static _instance = null;


    /**
     * MouseMgr class
     * @private
     */
    constructor() {
        this.x = 0;
        this.y = 0;
        this._state = {};
        this.state = {};
        this.button = {};
        Globals.engine.addToUpdate(this);
    }


    /**
     * Get the unique instance of MouseMgr
     * @returns {MouseMgr}
     */
    static get instance() {
        if (MouseMgr._instance === null) {
            MouseMgr._instance = new MouseMgr();
        }
        return MouseMgr._instance;
    }


    /**
     * Get button name
     * @param {MouseEvent} event
     * @private
     */
    _getButtonName(event) {
        switch (event.button) {
            case 0:
                return "left";
            case 1:
                return "middle";
            case 2:
                return "right";
            default:
                return "none";
        }
    }


    /**
     * On mouse move event listener
     * @param {MouseEvent} e
     */
    onMouseMove(e) {
        const rect = Globals.canvas.getBoundingClientRect();
        this.x = e.clientX - rect.left;
        this.y = e.clientY - rect.top;
    }


    /**
     * On mouse button down event listener
     * @param {MouseEvent} e
     */
    onMouseDown(e) {
        e.preventDefault();
        const button = this._getButtonName(e);
        this.button[button] = true;
        this._state[button] = "down";
        if (this.state[button] === undefined) {
            this.state[button] = "up";
        }
    }


    /**
     * On mouse button up event listener
     * @param {MouseEvent} e
     */
    onMouseUp(e) {
        e.preventDefault();
        const button = this._getButtonName(e);
        this.button[button] = false;
        this._state[button] = "up";
    }


    /**
     * Disable right clic menu
     * @param {MouseEvent} e
     */
    onContextMenu(e) {
        e.preventDefault();
    }


    /**
     * Check if mouse collide with given rectangle
     * @param {Number} x
     * @param {Number} y
     * @param {Number} width
     * @param {Number} height
     * @returns {boolean}
     */
    inBoundsRect(x, y, width, height) {
        return this.x >= x && this.x <= x + width &&
            this.y >= y && this.y <= y + height;
    }


    /**
     * Update mouse button states
     * @param {Number} dt
     */
    update(dt) {
        const oldState = this.state;

        for (let button in this._state) {
            const state = this._state[button];
            if (
                (oldState[button] === "up" || oldState[button] === "new_up") &&
                state === "down"
            ) {
                this.state[button] = "new_down";
            } else if(
                (oldState[button] === "down" || oldState[button] === "new_down") &&
                state === "up"
            ) {
                this.state[button] = "new_up";
            } else {
                this.state[button] = this._state[button];
            }
        }
    }


    /**
     * Change the cursor style
     * @param {string} cursor
     */
    setCursor(cursor) {
        Globals.canvas.style.cursor = cursor;
    }
}