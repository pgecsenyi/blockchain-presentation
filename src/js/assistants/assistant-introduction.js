import { CanvasResizer } from '../common/canvas-resizer';
import { EventHandler, EventHandlerManager } from '../framework/event-handler-manager';
import { ColorPair, Point, Range } from '../common/primitives';
import { default as timeline } from '../timeline-drawer';

export class AssistantIntroduction {
    constructor(canvasName) {
        var props = new timeline.TimelineProperties(
            new Point(150),
            new Range(2008, 2018),
            new ColorPair('#EEE', '#F47D3D'),
            '#F47D3D',
            '#555',
            true,
            10);

        this.drawer = new timeline.TimelineDrawer(canvasName, props);
        this.currentMoment = 0;
        this.moments = [
            new timeline.Moment(2008, '2008', 'Satoshi Nakamoto', 'image/ninja.svg'),
            new timeline.Moment(2010, '2010', '2 pizzas for\n10.000 BTC', 'image/pizza.svg'),
            new timeline.Moment(2011, '2011', '1 BTC = 1 USD', 'image/dollar.svg'),
            new timeline.Moment(2013, '2013', 'Ethereum', 'image/ethereum.svg'),
            new timeline.Moment(2017, '2017', 'BitcoinCash', 'image/external/bitcoincash.png')];

        this.eventHandlerManager = new EventHandlerManager();
        this.eventHandlerManager.addEventHandler(new EventHandler(document, 'keydown', e => this.onKeyDown(e)));

        this.resizer = new CanvasResizer(canvasName, () => this.drawer.draw());

        this.addNextMoment(true);
    }

    activate() {
        this.resizer.register();
        this.eventHandlerManager.registerHandlers();
    }

    deactivate() {
        this.eventHandlerManager.unregisterHandlers();
        this.resizer.unregister();
    }

    onKeyDown(keyboardEvent) {
        var keyCode = keyboardEvent.keyCode;
        var value = String.fromCharCode(keyCode).toLowerCase();

        if (value == 'a')
            this.addAllMoments();
        else if (value == 'n')
            this.addNextMoment();
    }

    addAllMoments() {
        while (this.currentMoment < this.moments.length) {
            this.drawer.addMoment(this.moments[this.currentMoment]);
            this.currentMoment++;
        }
        this.drawer.draw();
    }

    addNextMoment(passive) {
        if (this.currentMoment >= this.moments.length)
            return;

        this.drawer.addMoment(this.moments[this.currentMoment]);
        this.currentMoment++;

        if (!passive)
            this.drawer.draw();
    }
}
