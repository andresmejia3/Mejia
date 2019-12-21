
import React from "react";
import P5 from 'p5';
import json from './Skills.json';
import './Skills.css'
import {AppColors} from "../../utils/constant";
import {elementIsVisible} from "../../utils/helpers";
import avenir from '../../assets/fonts/AvenirNextLTPro-Demi.otf';

const MAX_SPEED = 20;
const MAX_FORCE = 10;
const RADIUS_PADDING_OFFSET = 1.5;
const TEXT_SIZE_SCREEN_WIDTH_RATIO = 0.01;
const ARRIVAL_DISTANCE = 100;
const CENTER = new P5.Vector(window.innerWidth / 2, window.innerHeight / 2);

export default class Skills extends React.Component {

    static P5_CANVAS_ID = 'P5_CANVAS_ID';

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const container = document.getElementById(Skills.P5_CANVAS_ID);
        skillsAnimation(container);
        // textAnimation(container)
    }

    render() {
        // marginLeft: '5%', marginRight: '5%'
        return (
            <div className='am-skills'>
                <p className='am-skills-main-title'>Skills</p>
                <p style={{color: 'white', paddingTop: 0, marginTop: 0}}>Click on the nodes to interact with them</p>

                <div id={Skills.P5_CANVAS_ID} style={{height: '100vh'}}/>
            </div>
        );
    }
}


function textAnimation(container) {

    return new P5(sketch => {

        let font;
        let vehicles = [];

        sketch.preload = () => {
            font = sketch.loadFont(avenir);
        };

        sketch.setup = () => {
            sketch.createCanvas(600, 300);
            sketch.background(51);

            const points = font.textToPoints('Mejia', 100, 200, 192);

            for (let i = 0; i < points.length; i++) {
                let pt = points[i];
                let vehicle = new Vehicle(sketch, pt.x, pt.y);
                vehicles.push(vehicle);
            }
        };

        sketch.draw = () => {
            sketch.background(51);

            for (let i = 0; i < vehicles.length; i++) {
                const v = vehicles[i];
                v.behaviors();
                v.update();
                v.show();
            }
        };

    }, container);
}


function skillsAnimation(container) {
    let currentlyActiveTextBubble = null;

    return new P5(sketch => {

        const textBubbles = [];
        const connectors = [];

        sketch.noLoop();

        sketch.setup = () => {
            const {offsetHeight: containerHeight, offsetWidth: containerWidth} = container;

            sketch.createCanvas(containerWidth , containerHeight);

            for (const skill in json.skills) {
                const {x, y, data} = json.skills[skill];
                const scaledX = x * containerWidth * 1.06;
                const scaledY = y * containerHeight;
                textBubbles.push(new TextBubble(sketch, scaledX, scaledY, skill, data));
            }


            //Init TextTable values
            for (let textBubble of textBubbles)
                textBubble.draw();

            //Set up connecting TextBubble lines and store them for efficiency
            for (let textBubble of textBubbles) {
                for (let target of textBubbles) {
                    const dist = sketch.dist(textBubble.pos.x, textBubble.pos.y, target.pos.x, target.pos.y);

                    if (textBubble !== target && dist < 2 * textBubble.diameter)
                        connectors.push({home: textBubble, target});
                }
            }


            //Stop rendering the canvas if it's not in the view port
            window.addEventListener('scroll', () => {
                if (elementIsVisible(container))
                    sketch.loop();
                else
                    sketch.noLoop();
            });
        };

        sketch.draw = () => {
            console.log('Canvas');
            const drawLast = [];
            let absoluteLast = null;

            sketch.background(AppColors.primaryColorString);
            sketch.stroke(255);

            const lineConnectingOffset = 5;

            //Draw connecting lines for TextBubbles
            for (let connector of connectors) {
                const {home, target} = connector;

                const offsetVector = P5.Vector.sub(target.pos, home.pos);
                offsetVector.normalize();
                offsetVector.mult((home.diameter - lineConnectingOffset) / 2);

                const isAnimating = home.isAnimating() || target.isAnimating();
                const homePos = isAnimating ? home.pos : home.origin;
                const targetPos = isAnimating ? target.pos : target.origin;

                const homeX = homePos.x + offsetVector.x;
                const homeY = homePos.y + offsetVector.y;

                offsetVector.normalize();
                offsetVector.mult((target.diameter - lineConnectingOffset) / 2);

                const targetX = targetPos.x - offsetVector.x;
                const targetY = targetPos.y - offsetVector.y;

                sketch.line(homeX, homeY, targetX, targetY);
            }

            //Update and draw TextBubbles and render clicked on TextBubble
            //last so it's drawn above the other TextBubbles
            TextBubble.resetElevation();

            for (let textBubble of textBubbles) {

                if (!textBubble.isAnimating()) {
                    textBubble.update();
                    textBubble.draw();
                    textBubble.assignElevation();

                } else if (currentlyActiveTextBubble === textBubble) {
                    absoluteLast = textBubble;

                } else {
                    drawLast.push(textBubble);
                }
            }


            if (absoluteLast)
                drawLast.push(absoluteLast);

            for (let textBubble of drawLast) {
                textBubble.update();
                textBubble.draw();
                textBubble.assignElevation();
            }
        };

        sketch.windowResized = () => {
            const {offsetHeight: containerHeight, offsetWidth: containerWidth} = container;

            sketch.resizeCanvas(containerWidth, containerHeight);

            CENTER.set(containerWidth / 2, containerHeight/ 2);

            textBubbles.length = 0;
            connectors.length = 0;

            for (const skill in json.skills) {
                const {x, y, data} = json.skills[skill];
                textBubbles.push(new TextBubble(sketch, x * containerWidth, y * containerHeight, skill, data));
            }

            //To init values
            for (let textBubble of textBubbles)
                textBubble.draw();

            for (let textBubble of textBubbles) {
                const {x, y} = json.skills[textBubble.header];
                const newX = x * containerWidth;
                const newY = y * containerHeight;

                textBubble.origin.set(newX, newY);
                textBubble.pos.set(newX, newY);
            }

            for (let textBubble of textBubbles) {
                for (let target of textBubbles) {
                    const dist = sketch.dist(textBubble.pos.x, textBubble.pos.y, target.pos.x, target.pos.y);
                    if (textBubble !== target && dist < 2 * textBubble.diameter)
                        connectors.push({home: textBubble, target});
                }
            }

        };

        sketch.mouseClicked = () => {

            let mostElevatedTextBubble = null;

            for (let textBubble of textBubbles) {

                if (textBubble.contains(sketch.mouseX, sketch.mouseY)) {

                    if (!mostElevatedTextBubble)
                        mostElevatedTextBubble = textBubble;

                    else if (mostElevatedTextBubble.getElevation() < textBubble.getElevation())
                        mostElevatedTextBubble = textBubble;

                } else {
                    textBubble.hasBeenClicked = false;
                }
            }

            mostElevatedTextBubble && (mostElevatedTextBubble.hasBeenClicked = !mostElevatedTextBubble.hasBeenClicked);
            currentlyActiveTextBubble = mostElevatedTextBubble;
        };

    }, container);

}




class TextBubble {

    static elevation = 0;

    constructor(sketch, x, y, header, listItems) {
        this.sketch = sketch;
        this.header = header;
        this.listItems = listItems;
        this.listItems.sort((n1, n2) => sketch.textWidth(n1) - sketch.textWidth(n2));

        this.origin = new P5.Vector(x, y);
        this.pos = new P5.Vector(x, y);
        this.vel = new P5.Vector(0, 0);
        this.acc = new P5.Vector(0, 0);
        this.hasBeenClicked = false;

        this.distanceGrowthFactor = 1;
    }

    static resetElevation() {
        TextBubble.elevation = 0;
    }

    draw() {
        const {sketch, origin, pos, header, listItems} = this;

        let distanceGrowthFactor = 1;

        const center = new P5.Vector(sketch.width / 2, sketch.height / 2);

        if (this.hasBeenClicked)
            this.seek(center);
        else
            this.seek(this.origin);

        if (this.isAnimating()) {
            const maxGrowthFactor = 2;
            const distFromCenter = sketch.dist(pos.x, pos.y, center.x, center.y);
            const originDistance = sketch.dist(origin.x, origin.y, center.x, center.y);
            distanceGrowthFactor = sketch.map(distFromCenter, originDistance, 0, 1, maxGrowthFactor, true);
        }
        const textSize = sketch.width * TEXT_SIZE_SCREEN_WIDTH_RATIO * distanceGrowthFactor;

        const input = sketch.width * TEXT_SIZE_SCREEN_WIDTH_RATIO * distanceGrowthFactor;
        const lowerBound = sketch.width * TEXT_SIZE_SCREEN_WIDTH_RATIO;
        const upperBound = sketch.width * TEXT_SIZE_SCREEN_WIDTH_RATIO * distanceGrowthFactor;

        const lowerMappedBound = sketch.width * TEXT_SIZE_SCREEN_WIDTH_RATIO;
        const upperMappedBound = sketch.width * TEXT_SIZE_SCREEN_WIDTH_RATIO * distanceGrowthFactor;

        // console.log('TextSize:', textSize, 'sketch.width:', sketch.width, 'SCREENSIZERATION:', TEXT_SIZE_SCREEN_WIDTH_RATIO, 'distanceGF:', distanceGrowthFactor);
        // console.log('sketch:', sketch, 'sketch.textSize:', sketch.textSize);
        sketch.textSize(textSize);

        const textHeight = sketch.textAscent() + sketch.textDescent();
        const maxWidth = Math.max(sketch.textWidth(header), ...listItems.map(listItem => sketch.textWidth(listItem)));
        const maxHeight = textHeight * (listItems.length + 1);
        const minBound = maxWidth < maxHeight ? maxWidth : maxHeight;
        const radiusScalar = Math.max(maxHeight, maxWidth) / Math.min(maxHeight, maxWidth);
        this.diameter = minBound * radiusScalar * RADIUS_PADDING_OFFSET;

        const alpha = 0.95;

        sketch.noStroke();
        sketch.fill(255, 255 * alpha);
        sketch.circle(pos.x, pos.y, this.diameter);

        sketch.fill(0, 255 * alpha);
        sketch.textStyle(sketch.BOLD);
        sketch.textAlign(sketch.CENTER, sketch.CENTER);
        sketch.text(header, pos.x, pos.y - (maxHeight / 2) + (textSize / 2));

        sketch.textStyle(sketch.NORMAL);

        let heightOffset = 1;
        this.listItems.forEach(listItem => {
            sketch.text(listItem, pos.x, pos.y - (maxHeight / 2) + (textSize / 2) + (textHeight * heightOffset++));
        });

    }
    update() {
        return;
        // const {sketch} = TextBubble;
        const {sketch, origin, pos, header, listItems} = this;

        if (this.hasBeenClicked)
            this.seek(CENTER);
        else
            this.seek(origin);

        this.distanceGrowthFactor = 1;

        if (this.isAnimating()) {
            const maxGrowFactor = 2;
            const distFromCenter = sketch.dist(pos.x, pos.y, CENTER.x, CENTER.y);
            const originDistance = sketch.dist(origin.x, origin.y, CENTER.x, CENTER.y);
            this.distanceGrowthFactor = sketch.map(distFromCenter, originDistance, 0, 1, maxGrowFactor, true);
        }

        this.textSize = sketch.width * TEXT_SIZE_SCREEN_WIDTH_RATIO * this.distanceGrowthFactor;
        this.listItems.sort((n1, n2) => sketch.textWidth(n1) - sketch.textWidth(n2));

        this.textHeight = sketch.textAscent() + sketch.textDescent();
        const maxWidth = Math.max(sketch.textWidth(header), ...listItems.map(listItem => sketch.textWidth(listItem)));
        this.maxHeight = this.textHeight * (listItems.length + 1);
        const minBound = maxWidth < this.maxHeight ? maxWidth : this.maxHeight;
        const radiusScalar = Math.max(this.maxHeight, maxWidth) / Math.min(this.maxHeight, maxWidth);
        this.diameter = minBound * radiusScalar * RADIUS_PADDING_OFFSET;
    }

    seek(target) {
        const {sketch, pos, vel, acc} = this;
        const desired = P5.Vector.sub(target, pos);
        const distFromTarget = desired.mag();
        desired.normalize();

        if (distFromTarget < ARRIVAL_DISTANCE)
            desired.mult(sketch.map(distFromTarget, 0, ARRIVAL_DISTANCE, 0, MAX_SPEED));
        else
            desired.mult(MAX_SPEED);

        const steer = P5.Vector.sub(desired, vel);
        steer.limit(MAX_FORCE);

        acc.add(steer);
        vel.add(acc);
        vel.limit(MAX_SPEED);
        pos.add(vel);
        acc.mult(0);
    }

    contains(x, y) {
        const {sketch, pos, diameter} = this;
        return sketch.dist(pos.x, pos.y, x, y) <= diameter / 2;
    }

    isAnimating() {
        return !this.pos.equals(this.origin.x, this.origin.y);
    }

    assignElevation() {
        this.elevation = TextBubble.elevation++;
    }

    getElevation() {
        return this.elevation;
    }
}

function Vehicle(sketch, x, y) {
    this.sketch = sketch;
    this.pos = sketch.createVector(sketch.random(sketch.width), sketch.random(sketch.height));
    this.target = sketch.createVector(x, y);
    this.vel = P5.Vector.random2D();
    this.acc = sketch.createVector();
    this.r = 8;
    this.maxspeed = 10;
    this.maxforce = 1;
}

Vehicle.prototype.behaviors = function() {
    const {sketch} = this;
    const arrive = this.arrive(this.target);
    const mouse = sketch.createVector(sketch.mouseX, sketch.mouseY);
    const flee = this.flee(mouse);

    arrive.mult(1);
    flee.mult(5);

    this.applyForce(arrive);
    this.applyForce(flee);
};

Vehicle.prototype.applyForce = function(f) {
    this.acc.add(f);
};

Vehicle.prototype.update = function() {
    this.pos.add(this.vel);
    this.vel.add(this.acc);
    this.acc.mult(0);
};

Vehicle.prototype.show = function() {
    this.sketch.stroke(255);
    this.sketch.strokeWeight(this.r);
    this.sketch.point(this.pos.x, this.pos.y);
};


Vehicle.prototype.arrive = function(target) {
    const desired = P5.Vector.sub(target, this.pos);
    const d = desired.mag();
    let speed = this.maxspeed;

    if (d < 100)
        speed = this.sketch.map(d, 0, 100, 0, this.maxspeed);

    desired.setMag(speed);
    const steer = P5.Vector.sub(desired, this.vel);
    steer.limit(this.maxforce);
    return steer;
};

Vehicle.prototype.flee = function(target) {
    const desired = P5.Vector.sub(target, this.pos);
    const d = desired.mag();

    if (d < 50) {
        desired.setMag(this.maxspeed);
        desired.mult(-1);
        const steer = P5.Vector.sub(desired, this.vel);
        steer.limit(this.maxforce);
        return steer;
    } else {
        return this.sketch.createVector(0, 0);
    }
};
