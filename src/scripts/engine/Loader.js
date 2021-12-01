import {Sprite} from "./Sprite";
import {Globals} from "./Globals";
import {SpriteSheet} from "./SpriteSheet";


export class Loader {
    static _instance = null;


    /**
     * Loader class
     * @private
     */
    constructor() {
        this._assets = [];
        this._loaderassetsCount = 0;
        this.loadingFinished = false;
    }


    /**
     * Get the unique instance of Loader
     * @returns {Loader}
     */
    static get instance() {
        if (Loader._instance === null) {
            Loader._instance = new Loader();
        }
        return Loader._instance;
    }


    /**
     * Return true if assets loading finished
     * @returns {boolean}
     */
    get finished() {
        return this.loadingFinished;
    }


    /**
     * Add assets to the load queue
     * @param {Array<Object>} assets
     */
    addAssets(assets) {
        assets.forEach(asset => {
            this.addAsset(asset);
        });
    }


    /**
     * Add an asset to the load queue
     * @param {Object} asset
     */
    addAsset(asset) {
        this._assets.push(asset);
    }


    /**
     * Start the assets loading
     */
    load() {
        if (this._assets.length === 0) {
            this.loadingFinished = true;
            return;
        }

        this._assets.forEach(asset => {
            if (asset.type === "sprite") {
                this._loadSprite(asset.name, asset.url);
            } else if (asset.type === "spritesheet") {
                this._loadSpriteSheet(
                    asset.name,
                    asset.url,
                    asset.frame.width,
                    asset.frame.height,
                    asset.animations
                );
            } else if (asset.type === "sound") {
                this._loadSound(asset.name, asset.url);
            } else if (asset.type === "font") {
                this._loadFont(asset.name, asset.url);
            } else {
                throw new Error(`${asset.type} is not a valid asset type!`);
            }
        });
    }


    /**
     * Load sprite
     * @param {String} name
     * @param {String} url
     * @private
     */
    _loadSprite(name, url) {
        let sprite = new Sprite(url);
        sprite.on("load", () => this._onAssetLoaded());
        Globals.resource.sprite[name] = sprite;
    }


    /**
     * Load sprite sheet
     * @param {String} name
     * @param {String} url
     * @param {Number} frameWidth
     * @param {Number} frameHeight
     * @param {Array<Object>} animations
     * @private
     */
    _loadSpriteSheet(name, url, frameWidth, frameHeight, animations) {
        let spriteSheet = new SpriteSheet(url, frameWidth, frameHeight, animations);
        spriteSheet.on("load", () => this._onAssetLoaded());
        Globals.resource.spriteSheet[name] = spriteSheet;
    }


    /**
     * Load sound
     * @param {String} name
     * @param {String} url
     * @private
     */
    _loadSound(name, url) {
        let sound = new Audio(url);
        sound.oncanplaythrough = this._onAssetLoaded.bind(this);
        Globals.resource.sound[name] = sound;
    }


    /**
     * Load font
     * @param {String} name
     * @param {String} url
     * @private
     */
    _loadFont(name, url) {
        let font = new FontFace(name, `url(${url})`);
        font.load().then(f => {
            document.fonts.add(f);
            this._onAssetLoaded();
        });
    }


    /**
     * Callback for finished asset loading
     * @private
     */
    _onAssetLoaded() {
        this._loaderassetsCount++;

        if (this._loaderassetsCount === this._assets.length) {
            this.loadingFinished = true;
        }
    }
}