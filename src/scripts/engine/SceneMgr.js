import {Globals} from "./Globals";


export class SceneMgr {
    static _instance = null;


    /**
     * SceneMgr class
     * @private
     */
    constructor() {
        this._scenes = {};
        this._currentScene = null;
        this._previousScene = null;

        Globals.engine.addToUpdate(this);
        Globals.engine.addToDraw(this);
    }


    /**
     * Get the unique instance of SceneMgr
     * @returns {SceneMgr}
     */
    static get instance() {
        if (SceneMgr._instance === null) {
            SceneMgr._instance = new SceneMgr();
        }
        return SceneMgr._instance;
    }


    /**
     * Add a given scene into list of available scenes
     * @param {Scene} scene
     */
    addScene(scene) {
        this._scenes[scene.name] = scene;
    }


    /**
     * Switch the current scene
     * @param {String} scene
     */
    switch(scene) {
        if (this._currentScene !== null) {
            this._currentScene.clean();
        }

        this._previousScene = this._currentScene;
        this._currentScene = this._scenes[scene];
        this._currentScene.load();
    }


    /**
     * Switch to the previous scene
     */
    pop() {
        if (this._previousScene !== null) {
            this.switch(this._previousScene.name);
            this._previousScene = null;
        }
    }


    /**
     * Give all available scene name
     * @returns {Array<String>}
     */
    getAvailableScenes() {
        let scenes = [];
        for (let scene in this._scenes) {
            scenes.push(scene.name);
        }
        return scenes;
    }


    /**
     * Update the current scene
     * @param {Number} dt
     */
    update(dt) {
        if (this._currentScene !== null) {
            this._currentScene.update(dt);
        }
    }


    /**
     * Draw the current scene
     * @param {CanvasRenderingContext2D} ctx
     */
    draw(ctx) {
        if (this._currentScene !== null) {
            this._currentScene.draw(ctx);
        }
    }
}