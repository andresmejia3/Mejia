import React from "react";
import * as PIXI from 'pixi.js'
import {AppColors, EMPTY_FUNCTION} from "../../utils/constant";
import {elementIsVisible, random2DUnitVector, randomInt, p5Instance, pointsToBounds} from "../../utils/helpers";
import circleTexture from '../../assets/images/nodeAnimation/CirclePS1.png';
import autoBind from "react-autobind/src/autoBind";
import Vector from 'victor';
import Quadtree from 'quadtree-lib';
import avenirFont from '../../assets/fonts/AvenirNextLTPro-Demi.otf';
import Vehicle from './Vehicle';
import TransformableText from "./TransformableText";
import calculateFontSize from "calculate-size";

const NUM_OF_NODES = 40;
const SPEED_FACTOR = 0.25;
const RADIUS_MIN_LIMIT = 4;
const RADIUS_MAX_LIMIT = 2 * RADIUS_MIN_LIMIT;
const OPACITY_MIN_LIMIT = 200;
const OPACITY_MAX_LIMIT = 2 * OPACITY_MIN_LIMIT;
const CENTER_ANCHOR = new PIXI.Point(0.5, 0.5);
const HEADER_TEXT = 'Andres Mejia';
const SUBHEADER_TEXT = 'Software Engineer | React Native Developer | AI & Machine Learning Hobbyist';
const HEADER_FONT_SIZE_SCALAR = 0.085;
const SUBHEADER_FONT_SIZE_SCALAR = 0.02;

export default class NodeNetworkAnimation {

    static NODE_NETWORK_PIXI_ID = 'NODE_NETWORK_PIXI_ID';

    constructor(container, numOfNodes = NUM_OF_NODES) {
        autoBind(this);

        this.textGraphics = new PIXI.Graphics();
        this.fontLoaded = false;
        this.vehicles = [];
        this.font = p5Instance.loadFont(avenirFont, () => {
            this.transformableText = new TransformableText(this.app, container, texts, this.font);

            ////

            const points = this.font.textToPoints('Andres Mejia', 0, 0, 192, {
                sampleFactor: 0.20
            });
            for (let i = 0; i < points.length; i++) {
                const {x, y} = points[i];
                const vehicle = new Vehicle(this.app, container, this.textGraphics, x, y, 2);
                this.vehicles.push(vehicle);
            }

            // const fontBounds = calculateFontSize('AndresMejia', {font: 'Avenir', fontSize: 192});
            const fontBounds = pointsToBounds(points);
            this.textGraphics.position.x = (container.offsetWidth / 2) - (fontBounds.width / 2);
            this.textGraphics.position.y = (container.offsetHeight / 2) - (fontBounds.height / 2);

            //
            // this.textGraphics.x = container.offsetWidth / 2;
            // this.textGraphics.y = container.offsetHeight / 3;
            this.app.stage.addChild(this.textGraphics);
            this.fontLoaded = true;
        });


        this.lines = new PIXI.Graphics();
        this.nodes = Array(numOfNodes).fill(0).map(() => new Node(container));
        this.shouldRequestFrame = true;

        this.quadtree = new Quadtree({
            width: container.offsetWidth,
            height: container.offsetHeight,
            maxElements: 4
        });

        this.app = new PIXI.Application({
            width: container.offsetWidth,
            height: container.offsetHeight,
            backgroundColor: AppColors.primaryColorHex,
            resizeTo: container,
            antialias: true,
        });

        this.app.renderer.plugins.interaction.autoPreventDefault = false;


        const texts = ['Software Engineer', 'React Native Developer', 'AI & Machine Learning Hobbyist'];

        const particleContainer = new PIXI.ParticleContainer(NUM_OF_NODES, {tint: true});
        const headerFontSize = container.offsetWidth * HEADER_FONT_SIZE_SCALAR;
        const subheaderFontSize = container.offsetWidth * SUBHEADER_FONT_SIZE_SCALAR;

        const headerText = new PIXI.Text(HEADER_TEXT,{
            fontFamily : 'Arial',
            fontSize: headerFontSize,
            fill : 0xffffff,
            align: 'center'
        });

        headerText.x = container.offsetWidth;
        headerText.y = container.offsetHeight / 3;
        // headerText.alpha = 0.75;
        headerText.anchor.set(0.5, 0.5);

        const subheaderText = new PIXI.Text(SUBHEADER_TEXT, {
            fontFamily : 'Arial',
            fontSize: subheaderFontSize,
            fill : 0xffffff,
            align: 'center'
        });

        subheaderText.x = container.offsetWidth / 2;
        subheaderText.y = headerText.y + headerFontSize;
        // subheaderText.alpha = 0.75;
        subheaderText.anchor.set(0.5, 0.5);


        document.body.onresize = () => {
            const headerFontSize = container.offsetWidth * HEADER_FONT_SIZE_SCALAR;
            const subheaderFontSize = container.offsetWidth * SUBHEADER_FONT_SIZE_SCALAR;

            headerText.x = container.offsetWidth / 2;
            headerText.y = container.offsetHeight / 3;
            headerText.alpha = 0.75;
            headerText.anchor.set(0.5, 0.5);
            headerText.style.fontSize = headerFontSize;

            subheaderText.x = container.offsetWidth / 2;
            subheaderText.y = headerText.y + headerFontSize;
            subheaderText.alpha = 0.75;
            subheaderText.anchor.set(0.5, 0.5);
            subheaderText.style.fontSize = subheaderFontSize;
        };


        for (let node of this.nodes)
            particleContainer.addChild(node.sprite);

        this.app.stage.addChild(particleContainer, this.lines);
        container.appendChild(this.app.view);

        window.addEventListener('scroll', () => {

            if (elementIsVisible(this.app.view) && !this.shouldRequestFrame) {
                    this.shouldRequestFrame = true;
                    requestAnimationFrame(this.animate);

            } else if (!elementIsVisible(this.app.view)) {
                this.shouldRequestFrame = false;
            }
        });

        requestAnimationFrame(this.animate);
    }

    animate() {
        if (!this.shouldRequestFrame)
            return requestAnimationFrame(EMPTY_FUNCTION);

        this.nodes.forEach(node => node.update());

        this.lines.clear();
        this.quadtree.clear();
        this.quadtree.pushAll(this.nodes);

        this.quadtree.each(node => {
            this.quadtree.colliding(node).forEach(nodeInRange => {
                if (!node.connectedNodes.has(nodeInRange))
                    node.connectTo(nodeInRange, this.lines);
            });
        });

        //TEXT ANIMATION START

        if (this.fontLoaded) {
            this.transformableText.clear();
            this.transformableText.draw();

            this.textGraphics.clear();

            for (let vehicle of this.vehicles) {
                vehicle.update();
                vehicle.draw();
            }
        }

        //TEXT ANIMATION FINISH

        console.log('Pixi');
        requestAnimationFrame(this.animate);
    }

    getCanvas() {
        return this.app.view;
    }
}


class Node {

    constructor(container) {
        this.container = container;
        this.sprite = PIXI.Sprite.from(circleTexture);
        // this.connectingDistance = randomInt(100, 100 * 4);
        this.connectingDistance = 150;
        this.connectedNodes = new Set();
        this.scaleDivider = randomInt(RADIUS_MIN_LIMIT, RADIUS_MAX_LIMIT);
        this.sprite.scale.set(1 / this.scaleDivider);
        this.opacitySpeed = randomInt(OPACITY_MIN_LIMIT, OPACITY_MAX_LIMIT);
        this.opacityDirection = Math.random() < 0.5;
        this.lastOpacityUpdate = Date.now();
        this.radius = this.sprite.width;

        this.velocity = random2DUnitVector().multiplyScalar(SPEED_FACTOR);
        this.position = new Vector(
            randomInt(this.radius + 1, container.offsetWidth - this.radius - 1),
            randomInt(this.radius + 1, container.offsetHeight - this.radius - 1)
        );

        //We set this after the position/velocity vectors have been initialized because we need those values
        this.sprite.anchor = CENTER_ANCHOR;
        this.sprite.x = this.position.x;
        this.sprite.y = this.position.y;
        this.sprite.alpha = Math.random();


        //This is for the Quadtree class so our node class can be inserted into it
        this.x = this.position.x;
        this.y = this.position.y;
        this.width = this.connectingDistance;
        this.height = this.connectingDistance;
    }

    update() {
        const newPosition = this.position.clone().add(this.velocity);

        if ((newPosition.x <= 0) ||
            (newPosition.x >= this.container.offsetWidth) ||
            (newPosition.y <= 0) ||
            (newPosition.y >= this.container.offsetHeight))
            this.velocity.multiplyScalar(-1);

        this.position.add(this.velocity);
        this.sprite.x = this.position.x;
        this.sprite.y = this.position.y;

        //This is for the quadtree
        this.x = this.position.x;
        this.y = this.position.y;

        const now = Date.now();

        if (now - this.lastOpacityUpdate >= this.opacitySpeed) {
            this.lastOpacityUpdate = now;

            let nextAlphaValue = this.sprite.alpha + (this.opacityDirection ? 0.01 : -0.01);

            if (nextAlphaValue <= 0.0 || nextAlphaValue >= 1.0)
                this.opacityDirection = !this.opacityDirection;

            if (this.opacityDirection)
                this.sprite.alpha += 0.01;
            else
                this.sprite.alpha -= 0.01;
        }
    }

    connectTo(nodeInRange, graphics) {
        const alpha = this.sprite.alpha < nodeInRange.sprite.alpha ? this.sprite.alpha : nodeInRange.sprite.alpha;

        const offsetVector = nodeInRange.position.clone().subtract(this.position);
        offsetVector.normalize();
        offsetVector.multiplyScalar(this.radius / 2);

        graphics.lineStyle(2, 0xffffff, alpha);
        graphics.moveTo(this.x + offsetVector.x, this.y + offsetVector.y);

        offsetVector.normalize();
        offsetVector.multiplyScalar(nodeInRange.radius / 2);


        graphics.lineTo(nodeInRange.x - offsetVector.x, nodeInRange.y - offsetVector.y);

        nodeInRange.connectedNodes.add(this);

    }

}


// function Vehicle(x, y, ) {
//     this.pos = createVector(random(width), random(height));
//     this.target = createVector(x, y);
//     this.vel = p5.Vector.random2D();
//     this.acc = createVector();
//     this.r = 8;
//     this.maxspeed = 10;
//     this.maxforce = 1;
// }
//
// Vehicle.prototype.behaviors = function() {
//     var arrive = this.arrive(this.target);
//     var mouse = createVector(mouseX, mouseY);
//     var flee = this.flee(mouse);
//
//     arrive.mult(1);
//     flee.mult(5);
//
//     this.applyForce(arrive);
//     this.applyForce(flee);
// }
//
// Vehicle.prototype.applyForce = function(f) {
//     this.acc.add(f);
// }
//
// Vehicle.prototype.update = function() {
//     this.pos.add(this.vel);
//     this.vel.add(this.acc);
//     this.acc.mult(0);
// }
//
// Vehicle.prototype.show = function() {
//     stroke(255);
//     strokeWeight(this.r);
//     point(this.pos.x, this.pos.y);
// }
//
//
// Vehicle.prototype.arrive = function(target) {
//     var desired = p5.Vector.sub(target, this.pos);
//     var d = desired.mag();
//     var speed = this.maxspeed;
//     if (d < 100) {
//         speed = map(d, 0, 100, 0, this.maxspeed);
//     }
//     desired.setMag(speed);
//     var steer = p5.Vector.sub(desired, this.vel);
//     steer.limit(this.maxforce);
//     return steer;
// }
//
// Vehicle.prototype.flee = function(target) {
//     var desired = p5.Vector.sub(target, this.pos);
//     var d = desired.mag();
//     if (d < 50) {
//         desired.setMag(this.maxspeed);
//         desired.mult(-1);
//         var steer = p5.Vector.sub(desired, this.vel);
//         steer.limit(this.maxforce);
//         return steer;
//     } else {
//         return createVector(0, 0);
//     }
// }
