import { CanvasResizer } from '../common/canvas-resizer';
import { EventHandler, EventHandlerManager } from '../framework/event-handler-manager';
import { Point, Range } from '../common/primitives';
import { NullableNinjaElement } from '../framework/ninja-element.js';
import { default as curveplot } from '../curve-plot';

export class AssistantEcc {
    constructor(canvasName) {
        this.canvasName = canvasName;

        this.curveParameterA = -2.2;
        this.curveParameterB = 2.4;
        this.curveParameterM = 0;
        this.sumPointColor = '#6A23DD';
        this.createPlotters();
        this.findCanvas();

        this.equationEditor = new CurveEquationEditor(
            this.curveParameterA,
            this.curveParameterB,
            this.curveParameterM,
            (a, b, m) => this.onEquationChanged(a, b, m));

        this.eventHandlerManager = new EventHandlerManager();
        this.eventHandlerManager.addEventHandler(new EventHandler(this.canvas, 'click', e => this.onClick(e)));
        this.eventHandlerManager.addEventHandler(new EventHandler(document, 'keydown', e => this.onKeyDown(e)));

        this.resizer = new CanvasResizer(canvasName, () => this.curvePlotterOrchestrator.draw());
    }

    activate() {
        this.resizer.register();
        this.eventHandlerManager.registerHandlers();
        this.equationEditor.initialize();
    }

    deactivate() {
        this.equationEditor.clean();
        this.eventHandlerManager.unregisterHandlers();
        this.resizer.unregister();
    }

    createPlotters() {
        var func = x => {
            var f = Math.sqrt(x * x * x + this.curveParameterA * x + this.curveParameterB);
            var result = [f, -f];
            if (this.curveParameterM != 0) {
                result[0] = this.calculateModulo(result[0], this.curveParameterM);
                result[1] = this.calculateModulo(result[1], this.curveParameterM);
            }
            return result;
        };

        this.scaleCalculator = new curveplot.ScaleCalculator(new Range(-10, 10), null);

        var axis = this.createAxis(this.scaleCalculator);
        var curve = this.createEllipticCurve(this.scaleCalculator, func);
        this.curvePointsVisual = this.createPoints(this.scaleCalculator, func);
        this.linesVisual = this.createLines(this.scaleCalculator, func);
        this.createCurvePlotterOrchestrator(this.scaleCalculator, axis, curve);
    }

    calculateModulo(dividend, modulus) {
        return ((dividend % modulus) + modulus) % modulus;
    }

    createAxis(scaleCalculator) {
        var properties = new curveplot.AxisProperties('#777', '#DDD');
        return new curveplot.AxisVisual(properties, scaleCalculator);
    }

    createEllipticCurve(scaleCalculator, func) {
        var properties = new curveplot.CurveProperties('#000', 0.01, true);
        return new curveplot.CurveVisual(properties, scaleCalculator, func);
    }

    createPoints(scaleCalculator, func) {
        var properties = new curveplot.CurvePointsProperties('#000');
        return new curveplot.CurvePointsVisual(properties, scaleCalculator, func);
    }

    createLines(scaleCalculator, func) {
        var properties = new curveplot.LinesProperties('#000');
        return new curveplot.LinesVisual(properties, scaleCalculator, func);
    }

    createCurvePlotterOrchestrator(scaleCalculator, axis, curve) {
        var properties = new curveplot.CurvePlotterOrchestratorProperties('#FFF');
        this.curvePlotterOrchestrator = new curveplot.CurvePlotterOrchestrator(
            this.canvasName,
            properties,
            scaleCalculator);

        this.curvePlotterOrchestrator.addLayer(axis);
        this.curvePlotterOrchestrator.addLayer(curve);
        this.curvePlotterOrchestrator.addLayer(this.linesVisual);
        this.curvePlotterOrchestrator.addLayer(this.curvePointsVisual);
    }

    findCanvas() {
        this.canvas = document.getElementById(this.canvasName);
        if (this.canvas == null || !this.canvas.getContext)
            throw 'No canvas available with this name.';
    }

    onEquationChanged(curveParameterA, curveParameterB, curveParameterM) {
        this.curveParameterA = curveParameterA;
        this.curveParameterB = curveParameterB;
        this.curveParameterM = curveParameterM;
        this.curvePlotterOrchestrator.draw();
    }

    onClick(mouseEvent) {
        var coordinates = this.getCursorPosition(mouseEvent);
        this.addPoints(coordinates);
        this.curvePlotterOrchestrator.draw();
    }

    getCursorPosition(mouseEvent) {
        var rect = this.canvas.getBoundingClientRect();
        var x = mouseEvent.clientX - rect.left;
        var y = mouseEvent.clientY - rect.top;

        return new Point(x, y);
    }

    onKeyDown(keyboardEvent) {
        var keyCode = keyboardEvent.keyCode;
        var value = String.fromCharCode(keyCode).toLowerCase();

        if (value == 'a') {
            this.move(-1, 0);
        } else if (value == 'c') {
            this.linesVisual.clear();
            this.curvePointsVisual.clear();
            this.curvePlotterOrchestrator.draw();
        } else if (value == 'd') {
            this.move(1, 0);
        } else if (value == 'e') {
            keyboardEvent.preventDefault();
            this.equationEditor.toggleEdit();
        } else if (value == 'i') {
            this.zoom(1);
        } else if (value == 'o') {
            this.zoom(-1);
        } else if (value == 'r') {
            this.scaleCalculator.reset();
            this.curvePlotterOrchestrator.draw();
        } else if (value == 's') {
            this.move(0, -1);
        } else if (value == 'w') {
            this.move(0, 1);
        } else if (value == 'z') {
            this.calculateAndDisplaySumOfLastTwoPoints();
        }
    }

    move(x, y) {
        var currentOffset = this.scaleCalculator.offset;
        var newOffset = currentOffset;
        newOffset.x += x;
        newOffset.y += y;

        this.scaleCalculator.offset = newOffset;
        this.curvePlotterOrchestrator.draw();
    }

    zoom(delta) {
        var currentScale = this.scaleCalculator.abscissaScale;

        var newScale = new Range(currentScale.start + delta, currentScale.end + (-1) * delta);
        if (newScale.length < 6 || newScale.length > 100)
            return;

        this.scaleCalculator.abscissaScale = newScale;
        this.curvePlotterOrchestrator.draw();
    }

    addPoints(position) {
        if (this.curvePointsVisual.count >= 2)
            return;

        if (position.isValid)
            this.curvePointsVisual.addPointPhysical(position, this.foregroundColor);
    }

    calculateAndDisplaySumOfLastTwoPoints() {
        if (this.curvePointsVisual.count < 2)
            return;

        var points = this.curvePointsVisual.points;
        var sum = this.calculateSumOfPoints(points[0], points[1]);

        var reflected = sum.clone();
        reflected.y *= -1;

        this.addLine(points[0], points[1], this.sumPointColor);
        this.addLine(sum, reflected, '#777');
        this.curvePointsVisual.addPointLogical(sum, this.sumPointColor);
        this.curvePlotterOrchestrator.draw();
    }

    calculateSumOfPoints(p0, p1) {
        if (!p0.isValid || !p1.isValid)
            return new Point(NaN, NaN);

        var x = Math.pow((p1.y - p0.y) / (p1.x - p0.x), 2) - p0.x - p1.x;
        var y = (-1) * p0.y + ((p1.y - p0.y) / (p1.x - p0.x)) * (p0.x - x);

        return new Point(x, y);
    }

    addLine(p0, p1, color) {
        if (p0.isValid && p1.isValid)
            this.linesVisual.add(p0, p1, color);
    }
}

class CurveEquationEditor {
    constructor(curveParameterA, curveParameterB, curveParameterM, curveEquationUpdatedCallback) {
        this.curveParameterA = curveParameterA;
        this.curveParameterB = curveParameterB;
        this.curveParameterM = curveParameterM;
        this.curveEquationUpdatedCallback = curveEquationUpdatedCallback;

        this.findElements();
        this.createEventHandlers();
    }

    clean() {
        this.eventHandlerManager.unregisterHandlers();
    }

    initialize() {
        this.eventHandlerManager.registerHandlers();
        this.updateDisplayedInfo();
    }

    toggleEdit() {
        this.eq.toggle();
        this.form.toggle();
        this.setFocus();
    }

    findElements() {
        this.elemCurveParameterA = document.getElementById('ecc-eq-a') || null;
        this.elemCurveParameterB = document.getElementById('ecc-eq-b') || null;
        this.eq = new NullableNinjaElement(document.getElementById('ec-curve-equation') || null);
        this.form = new NullableNinjaElement(document.getElementById('ecc-eq-parameters-form') || null);
    }

    createEventHandlers() {
        this.eventHandlerManager = new EventHandlerManager();

        if (this.form.innerElement != null) {
            let submitHandler = new EventHandler(this.form.innerElement, 'submit', () => this.onSubmit());
            this.eventHandlerManager.addEventHandler(submitHandler);
        }
        if (this.elemCurveParameterA != null) {
            let paramA = this.elemCurveParameterA;
            let keyDownHandler = new EventHandler(paramA, 'keydown', keyEvent => this.onInputKeyDown(keyEvent));
            let keyPressHandler = new EventHandler(paramA, 'keypress', keyEvent => this.onInputKeyPress(keyEvent));
            this.eventHandlerManager.addEventHandler(keyDownHandler);
            this.eventHandlerManager.addEventHandler(keyPressHandler);
        }
        if (this.elemCurveParameterB != null) {
            let paramB = this.elemCurveParameterB;
            let keyDownHandler = new EventHandler(paramB, 'keydown', keyEvent => this.onInputKeyDown(keyEvent));
            let keyPressHandler = new EventHandler(paramB, 'keypress', keyEvent => this.onInputKeyPress(keyEvent));
            this.eventHandlerManager.addEventHandler(keyDownHandler);
            this.eventHandlerManager.addEventHandler(keyPressHandler);
        }
    }

    setFocus() {
        if (this.form.isVisible) {
            document.getElementById('ecc-eq-a').select();
        }
    }

    onSubmit() {
        this.curveParameterA = this.elemCurveParameterA.value;
        this.curveParameterB = this.elemCurveParameterB.value;
        this.updateDisplayedInfo();
        this.toggleEdit();

        if (this.curveEquationUpdatedCallback != null) {
            let a = parseInt(this.curveParameterA);
            let b = parseInt(this.curveParameterB);
            let m = parseInt(this.curveParameterM);
            this.curveEquationUpdatedCallback(a, b, m);
        }
    }

    updateDisplayedInfo() {
        this.displayEquation();
        this.elemCurveParameterA.value = this.curveParameterA;
        this.elemCurveParameterB.value = this.curveParameterB;
    }

    displayEquation() {
        if (this.eq.innerElement == null)
            return;

        var signA = this.curveParameterA < 0 ? '-' : '+';
        var signB = this.curveParameterB < 0 ? '-' : '+';
        this.eq.innerElement.innerHTML = '<span>y<sup>2</sup> = x<sup>3</sup> '
            + signA + ' ' + Math.abs(this.curveParameterA) + 'x '
            + signB + ' ' + Math.abs(this.curveParameterB);

        if (this.curveParameterM != 0)
            this.eq.innerElement.innerHTML += ' (mod ' + this.curveParameterM + ')';

        this.eq.innerElement.innerHTML += '</span>';
    }

    onInputKeyDown(keyEvent) {
        keyEvent.stopPropagation();
    }

    onInputKeyPress(keyEvent) {
        var keyCode = keyEvent.charCode;
        var value = String.fromCharCode(keyCode).toLowerCase();

        if (value == 'e' || keyEvent.keyCode == 27) {
            this.toggleEdit();
            this.updateDisplayedInfo();
            keyEvent.preventDefault();
            keyEvent.stopPropagation();
        } else if ((value >= 'A' && value <= 'Z') || (value >= 'a' && value <= 'z')) {
            keyEvent.preventDefault();
            keyEvent.stopPropagation();
        }
    }
}
