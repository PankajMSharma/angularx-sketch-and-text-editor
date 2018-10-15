import { ElementSettings } from './element-settings';

export class SelectorSettings extends ElementSettings {
    private _stroke: string;
    private _selectorBoxFill: string;
    private _circleFill: string;
    private _strokeWidth: string;
    private _pointerEvents: string;
    private _circleRadius: string;

    constructor() {
        super();
        this.stroke = '#22C';
        this.selectorBoxFill = 'none';
        this.circleFill = '#22C';
        this.strokeWidth = '2';
        this.pointerEvents = 'all';
        this.circleRadius = '4';
    }

    get stroke(): string {
        return this._stroke;
    }

    set stroke(stroke: string) {
        this._stroke = stroke;
    }

    get selectorBoxFill(): string {
        return this._selectorBoxFill;
    }

    set selectorBoxFill(selectorBoxFill: string) {
        this._selectorBoxFill = selectorBoxFill;
    }

    get circleFill(): string {
        return this._circleFill;
    }

    set circleFill(circleFill: string) {
        this._circleFill = circleFill;
    }

    get strokeWidth(): string {
        return this._strokeWidth;
    }

    set strokeWidth(strokeWidth: string) {
        this._strokeWidth = strokeWidth;
    }

    get pointerEvents(): string {
        return this._pointerEvents;
    }

    set pointerEvents(pointerEvents: string) {
        this._pointerEvents = pointerEvents;
    }

    get circleRadius(): string {
        return this._circleRadius;
    }

    set circleRadius(circleRadius: string) {
        this._circleRadius = circleRadius;
    }
}
