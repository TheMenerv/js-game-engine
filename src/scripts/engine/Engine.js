import {Globals} from "./Globals";
import {Loader} from "./Loader";
import {KeyboardMgr} from "./KeyboardMgr";
import {MouseMgr} from "./MouseMgr";
import {SceneMgr} from "./SceneMgr";


const LOGO = `
    ███╗   ███╗      ███████╗███╗   ██╗ ██████╗ ██╗███╗   ██╗███████╗
    ████╗ ████║      ██╔════╝████╗  ██║██╔════╝ ██║████╗  ██║██╔════╝
    ██╔████╔██║█████╗█████╗  ██╔██╗ ██║██║  ███╗██║██╔██╗ ██║█████╗
    ██║╚██╔╝██║╚════╝██╔══╝  ██║╚██╗██║██║   ██║██║██║╚██╗██║██╔══╝
    ██║ ╚═╝ ██║      ███████╗██║ ╚████║╚██████╔╝██║██║ ╚████║███████╗
    ╚═╝     ╚═╝      ╚══════╝╚═╝  ╚═══╝ ╚═════╝ ╚═╝╚═╝  ╚═══╝╚══════╝
    HTML5 Game Engine powered by Menerv.
    Copyright © 2021, all rights reserved.
`;


export class Engine {
    /**
     * Engine class
     * @param {Object} config
     */
    constructor(config) {
        this.version = 1;
        this.config = config;
        this._setConsoleLog();
        this._drawLogo();
        this._gameLoopInit();
        this._engineInit();
        Globals.engine = this;
        Globals.loader = Loader.instance;
        Globals.keyboardMgr = KeyboardMgr.instance;
        Globals.mouseMgr = MouseMgr.instance;
        Globals.sceneMgr = SceneMgr.instance;
    }


    /**
     * Remove console.log() if “env“ is not “dev“
     * @private
     */
    _setConsoleLog() {
        if (this.config["env"] !== "dev") {
            console.log = () => {};
        }
    }


    /**
     * Display engine logo in console
     * @private
     */
    _drawLogo() {
        console.log(`${LOGO}    version ${this.version}`);
    }


    /**
     * Game loop vars initialisation
     * @private
     */
    _gameLoopInit() {
        this._windowResizeEventSub = false;
        this._lastUpdate = 0;
        this.dt = 0;
        this.ctx = null;
    }


    /**
     * Engine vars initialisation
     * @private
     */
    _engineInit() {
        this._updatables = [];
        this._drawables = [];
    }


    /**
     * Add an instance to game loop update
     * @param {Object} updatable
     * @param {Number} order
     */
    addToUpdate(updatable, order = 0) {
        this._updatables.push({ updatable, order });
        this._updatables.sort((u1, u2) => u1.order - u2.order);
    }


    /**
     * Remove an instance to game loop update
     * @param {Object} updatable
     */
    removeToUpdate(updatable) {
        this._updatables = this._updatables.filter(u => u !== updatable);
    }


    /**
     * Add an instance to game loop draw
     * @param {Object} drawable
     * @param {Number} order
     */
    addToDraw(drawable, order = 0) {
        this._drawables.push({ drawable, order });
        this._drawables.sort((d1, d2) => d1.order - d2.order);
    }


    /**
     * Remove an instance to game loop draw
     * @param {Object} drawable
     */
    removeToDraw(drawable) {
        this._drawables = this._drawables.filter(d => d !== drawable);
    }


    /**
     * Engine start
     */
    start() {
        this._createCanvas();
        this._setAliasing();
        this._addEventListeners();
        this._run();
    }


    /**
     * Canvas create and insert it into the page
     * @private
     */
    _createCanvas() {
        Globals.canvas = document.createElement("canvas");
        Globals.canvas.id = "canvas";
        Globals.canvas.tabIndex = 1;
        this._setCanvasSize();
        this.config.canvasNode.appendChild(Globals.canvas);
        Globals.ctx = Globals.canvas.getContext("2d");
    }


    /**
     * Resize the canvas
     * @private
     */
    _setCanvasSize() {
        let width = this.config.canvasWidth === "auto" || this.config.aspectRatio !== null ?
            window.innerWidth : this.config.canvasWidth;

        let height = this.config.canvasHeight === "auto" || this.config.aspectRatio !== null ?
            window.innerHeight : this.config.canvasHeight;

        if (this.config.aspectRatio !== null) {
            const ar = this.config.aspectRatio.split("/");
            ar[0] = parseInt(ar[0]);
            ar[1] = parseInt(ar[1]);

            if (width / ar[0] > height / ar[1]) {
                width = height / ar[1] * ar[0];
            } else {
                height = width / ar[0] * ar[1];
            }
        }

        Globals.canvas.width = width;
        Globals.canvas.height = height;

        if (
            !this._windowResizeEventSub && this.config.hotResize &&
            (this.config.canvasWidth === "auto" || this.config.canvasHeight === "auto" || this.config.aspectRatio !== null)
        ) {
            window.onresize = () => {
                this._setCanvasSize();
            };
            this._windowResizeEventSub = true;
        }
    }


    /**
     * Un/set anti aliasing
     * @private
     */
    _setAliasing() {
        const aliasing = this.config.aliasing;
        Globals.ctx.imageSmoothingEnabled = aliasing;
        Globals.ctx.msImageSmoothingEnabled = aliasing;
        Globals.ctx.webkitImageSmoothingEnabled = aliasing;
        Globals.ctx.mozImageSmoothingEnabled = aliasing;
        Globals.ctx.oImageSmoothingEnabled = aliasing;
    }


    /**
     * Add event listeners
     * @private
     */
    _addEventListeners() {
        // Keyboard events
        Globals.canvas.addEventListener("keydown", Globals.keyboardMgr.onKeyDown.bind(Globals.keyboardMgr));
        Globals.canvas.addEventListener("keyup", Globals.keyboardMgr.onKeyUp.bind(Globals.keyboardMgr));
        // Mouse events
        Globals.canvas.addEventListener("mousemove", Globals.mouseMgr.onMouseMove.bind(Globals.mouseMgr));
        Globals.canvas.addEventListener("mousedown", Globals.mouseMgr.onMouseDown.bind(Globals.mouseMgr));
        Globals.canvas.addEventListener("mouseup", Globals.mouseMgr.onMouseUp.bind(Globals.mouseMgr));
        Globals.canvas.addEventListener("contextmenu", Globals.mouseMgr.onContextMenu.bind(Globals.mouseMgr));
    }


    /**
     * Game loop running
     * @param {Number} time
     * @private
     */
    _run(time = 0) {
        requestAnimationFrame(this._run.bind(this));

        this.dt = (time - this._lastUpdate) / 1000;
        if (this.dt < (1 / this.config.fpsMax) - 0.001) return;
        this._lastUpdate = time;

        if (!Globals.loader.finished) return;

        this._updatables.forEach(u => {
            u.updatable.update(this.dt);
        });

        Globals.ctx.clearRect(0, 0, Globals.canvas.width, Globals.canvas.height);
        this._showFPS();

        this._drawables.forEach(d => {
            Globals.ctx.save();
            d.drawable.draw(Globals.ctx);
            Globals.ctx.restore();
        });
    }


    /**
     * Displaying FPS on screen
     * @private
     */
    _showFPS() {
        if (!this.config.showFPS) return;

        Globals.ctx.fillStyle = "White";
        Globals.ctx.font = "normal 10pt Arial";
        const text = `FPS: ${Math.round(1 / this.dt)}`;
        Globals.ctx.fillText(text, 10, 20);
    }


    /**
     * Set the focus on to the canvas
     */
    setFocus() {
        Globals.canvas.focus();
    }
}