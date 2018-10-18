import { Shape } from './shape';
import { RECTANGLE_ATTRS, TOOL_TAGNAMES } from '../constants/namespace';
import { DomRendererService } from '../services/dom-renderer/domrenderer.service';
import { RectangleSettings } from './settings/rectangle-settings';
import { ATTR_FUNC } from '../constants/resize-handler';
import { ShapeConfigGenerator } from '../services/shape-config-generator/shape-config-generator';

export class Rectangle implements Shape {
    private shapeConfigGenerator: ShapeConfigGenerator<RectangleSettings>;

    constructor(private domRenderer: DomRendererService) {
        this.shapeConfigGenerator = new ShapeConfigGenerator();
    }

    public createElement(shape: Shape, event: MouseEvent, id: string, hostElement?: any): Element {
        const attr: Map<string, string> = this.shapeConfigGenerator.getElementAttr(shape, event, id);
        return this.domRenderer.createSVGElement(TOOL_TAGNAMES.RECTANGLE, attr);
    }

    public getRectangleConfig(event: MouseEvent, id: string): Map<string, string> {
        const dataMap: Map<string, string> = new Map();

        const rectangleSettings = new RectangleSettings(event, id);

        Object.keys(RECTANGLE_ATTRS).forEach((attr: string) => {
            if (ATTR_FUNC[attr]) {
                ATTR_FUNC[attr](dataMap, RECTANGLE_ATTRS[attr], rectangleSettings);
            }
        });

        return dataMap;
    }
}
