import {Sprite} from "./Sprite";


export class SpriteSheet extends Sprite {
    /**
     * SpriteSheet class
     * @param {String} url
     * @param {Number} frameWidth
     * @param {Number} frameHeight
     * @param {Array<Object>} animations
     */
    constructor(url, frameWidth, frameHeight, animations) {
        super(url);

        this._frameWidth = frameWidth;
        this._frameHeight = frameHeight;
        this._currentAnimation = null;
        this._currentAnimationFrame = 0;
        this._animationTimer = 0;
        this._animations = animations;
        this.animationFinished = false;
    }


    /**
     * Change the current animation
     * @param {String} name
     */
    setAnimation(name) {
        if (this._currentAnimation != null) {
            if (this._currentAnimation.name === name) {
                return;
            }
        }

        let found = false;

        this._animations.forEach(animation => {
            if (animation.name === name) {
                this._currentAnimation = animation;
                this._currentAnimationFrame = 0;
                this.animationFinished = false;
                this._animationTimer = 0;
                found = true;
            }
        });

        if (!found) {
            throw new Error(`Animation name "${name}" invalid!`);
        }
    }


    /**
     * Update sprite sheet
     * @param {Number} dt
     */
    update(dt) {
        if (this._currentAnimation === null) return;

        this._animationTimer += dt;
        if (this._animationTimer >= 1/this._currentAnimation.speed) {
            this._animationTimer = 0;
            this._currentAnimationFrame++;
            if (this._currentAnimationFrame >= this._currentAnimation.frames.length) {
                if (this._currentAnimation.loop) {
                    this._currentAnimationFrame = 0;
                } else {
                    this._currentAnimationFrame = this._currentAnimation.frames.length - 1;
                    this.animationFinished = true;
                }
            }
        }
    }


    /**
     * Sprite drawing
     * @param {CanvasRenderingContext2D} ctx
     */
    draw(ctx) {
        const frameID = this._currentAnimation.frames[this._currentAnimationFrame];

        const columns = this._image.width / this._frameWidth;

        const line = Math.floor(frameID / columns);
        const column = frameID - (line * columns);

        const frameX = column * this._frameWidth;
        const frameY = line * this._frameHeight;

        const width = this._frameWidth * this._scale.x;
        const height = this._frameHeight * this._scale.y;

        const x = this.x - (width / 2);
        const y = this.y - (height / 2);

        ctx.drawImage(
            this._image,
            frameX,
            frameY,
            this._frameWidth,
            this._frameHeight,
            x,
            y,
            width,
            height
        );
    }
}