import { DrawingSettings } from './drawing-settings';
import { SVGElementSettings } from './svg-element-settings';

export class EllipseSettings extends SVGElementSettings {
    private _id: string;
    private _cx: string;
    private _cy: string;
    private _rx: string;
    private _ry: string;
    private _fill: string;
    private _stroke: string;
    private _strokeWidth: string;
    private _position: string;
    private drawingSettings: DrawingSettings;

    constructor(event: MouseEvent, id: string) {
        super();
        this.drawingSettings = DrawingSettings.getInstance();
        this.id = id;
        this.cx = event.clientX.toString();
        this.cy = event.clientY.toString();
        this.rx = '0';
        this.ry = '0';
        this.fill = this.drawingSettings.fill;
        this.stroke = this.drawingSettings.stroke;
        this.strokeWidth = this.drawingSettings.strokeWidth;
        this.position = 'absolute';
    }

    get id(): string {
        return this._id;
    }

    set id(id: string) {
        this._id = id;
    }

    get cx(): string {
        return this._cx;
    }

    set cx(cx: string) {
        this._cx = cx;
    }

    get cy(): string {
        return this._cy;
    }

    set cy(cy: string) {
        this._cy = cy;
    }

    get rx(): string {
        return this._rx;
    }

    set rx(rx: string) {
        this._rx = rx;
    }

    get ry(): string {
        return this._ry;
    }

    set ry(ry: string) {
        this._ry = ry;
    }

    get fill(): string {
        return this._fill;
    }

    set fill(fill: string) {
        this._fill = fill;
    }

    get stroke(): string {
        return this._stroke;
    }

    set stroke(stroke: string) {
        this._stroke = stroke;
    }

    get strokeWidth(): string {
        return this._strokeWidth;
    }

    set strokeWidth(strokeWidth: string) {
        this._strokeWidth = strokeWidth;
    }

    get position(): string {
        return this._position;
    }

    set position(position: string) {
        this._position = position;
    }
}
