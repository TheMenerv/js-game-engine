import {Engine} from "./engine/Engine";
import {GameConfig} from "./GameConfig";
import {AssetsConfig} from "./AssetsConfig";
import {Globals} from "./engine/Globals";


export class Game {
    /**
     * Game class
     */
    constructor() {}


    /**
     * Game start
     */
    start() {
        const engine = new Engine(GameConfig);

        Globals.loader.addAssets(AssetsConfig);
        Globals.loader.load();

        engine.start();

        window.onload = () => engine.setFocus();

        // Register and start scene here...
    }
}