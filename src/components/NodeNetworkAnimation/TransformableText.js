import * as PIXI from 'pixi.js';
import Vehicle from "./Vehicle";
import {p5Instance, pointsToBounds, rightMostPoint} from '../../utils/helpers'
import calculateFontSize from 'calculate-size';
import p5 from 'p5'
const VEHICLE_RADIUS = 1;
const FONT_SIZE = 80;
// const SUBHEADER_FONT_SIZE_SCALAR = 0.08;


export default class TransformableText {

    constructor(app, container, texts, font) {
        this.container = container;
        this.texts = texts;
        this.font = font;
        this.graphics = new PIXI.Graphics();
        this.selectedTextIndex = 0;
        this.currentVehicleTextIndex = 0;
        this.vehicles = [];
        this.textPoints = [];
        this.fontSizes = [];

        this.maxNumberOfVehicles = 0;

        for (let text of this.texts) {
            // const subheaderFontSize = container.offsetWidth * SUBHEADER_FONT_SIZE_SCALAR;

            let fontSize = FONT_SIZE;

            // console.log('p5:', window);
            const fontBounds = calculateFontSize(text, {font: 'Avenir', fontSize});

            if (fontBounds.width > container.offsetWidth * 0.8)
                fontSize = 12 / fontBounds.width * (container.offsetWidth * 0.8);

            const textPoints = this.font.textToPoints(text, 0, 0, fontSize, {sampleFactor: 0.25});

            if (this.maxNumberOfVehicles < textPoints.length)
                this.maxNumberOfVehicles = textPoints.length;

            this.textPoints.push(textPoints);
        }


        for (let i = 0; i < this.maxNumberOfVehicles; i++) {

            if (i < this.textPoints[this.selectedTextIndex].length) {
                const textPoint = this.textPoints[this.selectedTextIndex][i];
                const vehicle = new Vehicle(app, container, this.graphics, textPoint.x, textPoint.y, VEHICLE_RADIUS);
                this.vehicles.push(vehicle);

            } else {
                const {pos} = this.vehicles[this.textPoints[this.selectedTextIndex].length - 1];
                const vehicle = new Vehicle(app, container, this.graphics, 0, 0, VEHICLE_RADIUS);
                vehicle.pos.x = pos.x;
                vehicle.pos.y = pos.y;
                this.vehicles.push(vehicle);
            }
        }


        for (let i = 0; i < this.textPoints.length; i++) {
            const lastVehicleIndex = this.textPoints[i].length - 1;
            const rightMostVehicle = rightMostPoint(this.textPoints[i]);

            if (i + 1 < this.textPoints.length) {
                console.log('prev:', i, 'next:', );
                for (let j = lastVehicleIndex + 1; j < this.textPoints[i + 1].length; j++) {
                    this.vehicles[j].tempTarget = rightMostVehicle;
                }
            }
        }

        app.stage.addChild(this.graphics);

        setInterval(() => {
            this.selectedTextIndex = (this.selectedTextIndex + 1 >= this.texts.length) ? 0 : this.selectedTextIndex + 1;
        }, 5000);
    }

    draw() {

        const numOfVehicles = this.textPoints[this.selectedTextIndex].length;
        const bounds = pointsToBounds(this.textPoints[this.selectedTextIndex]);
        this.graphics.position.x = (this.container.offsetWidth / 2) - (bounds.width / 2);
        this.graphics.position.y = (this.container.offsetHeight / 1.75) - (bounds.height / 1.75);

        //Setup vehicles for the current text
        if (this.currentVehicleTextIndex !== this.selectedTextIndex) {
            const textPoints = this.textPoints[this.selectedTextIndex];

            for (let i = 0; i < numOfVehicles; i++) {
                const {x, y} = textPoints[i];
                this.vehicles[i].target.x = x;
                this.vehicles[i].target.y = y;
            }
            this.currentVehicleTextIndex = this.selectedTextIndex;
        }


        for (let i = 0; i < numOfVehicles; i++) {
            this.vehicles[i].update();
            this.vehicles[i].draw();
        }

        for (let i = numOfVehicles; i < this.maxNumberOfVehicles; i++) {
            this.vehicles[i].updateToTempTarget();
        }
    }

    clear() {
        this.graphics.clear();
    }
}
