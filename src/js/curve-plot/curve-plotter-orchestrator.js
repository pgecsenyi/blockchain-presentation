import { Size } from '../common/primitives';

export class CurvePlotterOrchestrator {
    constructor(canvasName, properties, scaleCalculator) {
        this.properties = properties;
        this.scaleCalculator = scaleCalculator;

        this.layers = [];
        this.findCanvasContext(canvasName);
    }

    addLayer(layer) {
        this.layers.push(layer);
    }

    draw() {
        this.clearCanvas();
        this.setDrawingAreaParameters();

        for (let i = 0; i < this.layers.length; i++)
            this.layers[i].draw(this.context);
    }

    findCanvasContext(canvasName) {
        this.canvas = document.getElementById(canvasName);
        if (this.canvas == null || !this.canvas.getContext)
            throw 'No canvas available with this name.';

        this.context = this.canvas.getContext('2d');
    }

    clearCanvas() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.fillStyle = this.properties.backgroundColor;
        this.context.rect(0, 0, this.canvas.width, this.canvas.height);
        this.context.fill();
    }

    setDrawingAreaParameters() {
        var currentSize = new Size(this.canvas.width, this.canvas.height);
        this.scaleCalculator.rescale(currentSize);
    }
}

export class CurvePlotterOrchestratorProperties {
    constructor(backgroundColor) {
        this.backgroundColor = backgroundColor;
    }
}
