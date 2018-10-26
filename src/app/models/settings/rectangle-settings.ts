import { DrawingSettings } from './drawing-settings';
import { SVGElementSettings } from './svg-element-settings';

export class RectangleSettings extends SVGElementSettings {
    private _id: string;
    private _x: string;
    private _y: string;
    private _width: string;
    private _height: string;
    private _fill: string;
    private _stroke: string;
    private _strokeWidth: string;
    private _position: string;
    private drawingSettings: DrawingSettings;

    constructor(event: MouseEvent, id: string) {
        super();
        this.drawingSettings = DrawingSettings.getInstance();
        this.id = id;
        this.x = event.clientX.toString();
        this.y = event.clientY.toString();
        this.width = '0';
        this.height = '0';
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

    get x(): string {
        return this._x;
    }

    set x(x: string) {
        this._x = x;
    }

    get y(): string {
        return this._y;
    }

    set y(y: string) {
        this._y = y;
    }

    get width(): string {
        return this._width;
    }

    set width(width: string) {
        this._width = width;
    }

    get height(): string {
        return this._height;
    }

    set height(height: string) {
        this._height = height;
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
