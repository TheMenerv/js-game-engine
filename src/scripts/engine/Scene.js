export class Scene {
    /**
     * Scene class
     * @param {String} name
     */
    constructor(name) {
        this.name = name;
    }


    /**
     * On load the scene…
     */
    load() {}


    /**
     * On leave the scene…
     */
    clean() {}


    /**
     * Scene update
     * @param {Number} dt
     */
    update(dt) {}


    /**
     * Scene draw
     * @param {CanvasRenderingContext2D} ctx
     */
    draw(ctx) {}
}