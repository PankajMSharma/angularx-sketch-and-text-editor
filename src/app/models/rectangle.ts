import { Shape } from './shape';
import { RECTANGLE_ATTRS, TOOL_TAGNAMES } from '../constants/namespace';
import { DomRendererService } from '../services/dom-renderer/domrenderer.service';
import { RectangleSettings } from './settings/rectangle-settings';
import { ShapeConfigGenerator } from '../services/shape-config-generator/shape-config-generator';

export class Rectangle implements Shape {
    private shapeConfigGenerator: ShapeConfigGenerator<Rectangle>;
    public settings: RectangleSettings;

    constructor(private domRenderer: DomRendererService) {
        this.shapeConfigGenerator = new ShapeConfigGenerator();
    }

    public createElement(shape: Rectangle, event: MouseEvent, id: string, hostElement?: any): Element {
        this.settings = new RectangleSettings(event, id);

        const attr: Map<string, string> = this.shapeConfigGenerator.getElementAttr(shape, RECTANGLE_ATTRS, event, id);

        return this.domRenderer.createSVGElement(TOOL_TAGNAMES.RECTANGLE, attr);
    }
}
