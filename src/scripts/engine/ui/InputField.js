import {Globals} from "../Globals";


export class InputField {
    /**
     * InputField class
     * @param {number} x
     * @param {number} y
     * @param {function|null} onKeyEnter
     * @param {string} type
     * @param {string} placeholder
     * @param {object} style
     */
    constructor(x, y, onKeyEnter = null, type = "text", placeholder = "", style= {}) {
        this._onKeyEnterCallback = onKeyEnter;

        this.x = x;
        this.y = y;

        const rect = Globals.canvas.getBoundingClientRect();
        const _x = x + rect.left;
        const _y = y + rect.top;

        this._input = document.createElement("input");
        this._input.type = type;
        this._input.placeholder = placeholder;
        this._input.style.position = "fixed";
        this._input.style.left = _x + "px";
        this._input.style.top = _y + "px";
        for (let key in style) {
            this._input.style[key] = style[key];
        }

        if (this._onKeyEnterCallback !== null) {
            this._input.onkeydown = this._onKeyDown.bind(this);
        }

        this.value = this._input.value;
        this._destroyed = false;

        document.addEventListener("click", this._onClick.bind(this));

        this.width = this._input.offsetWidth;
        this.height = this._input.offsetHeight;
    }


    /**
     * On enter key pressed event
     * @param {KeyboardEvent} key
     * @private
     */
    _onKeyDown(key) {
        this.value = this._input.value;

        if (key.keyCode === 13 && this._onKeyEnterCallback !== null) {
            this._onKeyEnterCallback();
        }
    }


    /**
     * Unfocus the input if click outside the input
     * @param {Event} e
     * @private
     */
    _onClick(e) {
        if (e.target !== this._input) {
            this._input.blur();
        }
    }


    /**
     * Add input to the DOM
     */
    addToDOM() {
        document.body.appendChild(this._input);
    }


    /**
     * Destroy the input
     */
    destroy() {
        if (!this._destroyed) {
            document.body.removeChild(this._input);
            this._destroyed = true;
        }
    }


    /**
     * Enable or disable input
     * @param {boolean} disabled
     */
    disable(disabled) {
        this._input.disabled = disabled
    }
}