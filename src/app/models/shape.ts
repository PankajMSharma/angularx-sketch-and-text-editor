import { SVGElementSettings } from './settings/svg-element-settings';

export interface Shape {
    settings: SVGElementSettings;
    createElement(shape: Shape, event: MouseEvent, id: String, hostElement?: any): Element;
}
