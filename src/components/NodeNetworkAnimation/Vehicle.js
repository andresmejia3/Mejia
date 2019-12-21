import Vector from 'victor';
import {random2DUnitVector, randomInt, p5Instance} from "../../utils/helpers";
// const MAX_SPEED = 30;
// const MAX_FORCE = 5;
// const SEEK_FORCE = 1;
// const FLEE_FORCE = 5;

const MAX_SPEED = 15;
const MAX_FORCE = 1;
const SEEK_FORCE = 1;
const FLEE_FORCE = 5;

export default class Vehicle {

    constructor(app, container, graphics, x, y, radius, tempTarget = null) {
        const {offsetHeight: height, offsetWidth: width} = container;
        // console.log('width:', width, 'height:', height);
        this.app = app;
        this.graphics = graphics;
        this.target = new Vector(x, y);
        this.radius = radius;
        this.tempTarget = tempTarget;
        this.pos = new Vector(randomInt(-width / 2,  2 * width), randomInt(-height, 2*height));
        this.vel = random2DUnitVector();
        this.acc = new Vector(0, 0);
    }

    draw() {
        const {pos, graphics} = this;

        graphics.moveTo(pos.x, pos.y);
        // graphics.beginFill(0xffffff, 0.7);
        graphics.beginFill(0xffffff);
        graphics.drawCircle(pos.x, pos.y, this.radius);
        // graphics.drawStar(pos.x, pos.y, 3, this.radius);
        // graphics.drawRect(pos.x, pos.y, 4 * this.radius, this.radius);
        graphics.endFill();
    }

    update() {
        const {x, y} = this.app.renderer.plugins.interaction.mouse.getLocalPosition(this.graphics);

        const arrive = this.seek(this.target);
        const mouse = new Vector(x, y);
        const flee = this.flee(mouse);

        arrive.multiplyScalar(SEEK_FORCE);
        flee.multiplyScalar(FLEE_FORCE);

        this.acc.add(arrive);
        this.acc.add(flee);

        this.pos.add(this.vel);
        this.vel.add(this.acc);
        this.acc.multiplyScalar(0);
    }

    updateToTempTarget() {
        const {x, y} = this.app.renderer.plugins.interaction.mouse.getLocalPosition(this.graphics);

        const arrive = this.seek(this.tempTarget);
        const mouse = new Vector(x, y);
        const flee = this.flee(mouse);

        arrive.multiplyScalar(SEEK_FORCE);
        flee.multiplyScalar(FLEE_FORCE);

        this.acc.add(arrive);
        this.acc.add(flee);

        this.pos.add(this.vel);
        this.vel.add(this.acc);
        this.acc.multiplyScalar(0);
    }

    seek(target) {
        const desired = target.clone().subtract(this.pos);
        const d = desired.length();
        let speed = MAX_SPEED;

        if (d < 100)
            speed = p5Instance.map(d, 0, 100, 0, MAX_SPEED);

        desired.normalize().multiplyScalar(speed);
        let steer = desired.clone().subtract(this.vel);

        if (steer.length() > MAX_FORCE)
            steer.normalize().multiplyScalar(MAX_FORCE);

        return steer;
    }

    flee(target) {
        let desired = target.clone().subtract(this.pos);
        const d = desired.length();

        if (d < 50) {
            desired = desired.normalize().multiplyScalar(-MAX_SPEED);
            let steer = desired.clone().subtract(this.vel);

            if (steer.length() > MAX_FORCE)
                steer = steer.normalize().multiplyScalar(MAX_FORCE);

            return steer;
        }

        return new Vector(0, 0);

    }
}