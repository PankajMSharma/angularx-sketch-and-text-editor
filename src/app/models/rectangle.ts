import { Shape } from './shape';
import { RECTANGLE_ATTRS, TOOL_TAGNAMES } from '../constants/namespace';
import { DomRendererService } from '../services/dom-renderer/domrenderer.service';
import { RectangleSettings } from './settings/rectangle-settings';
import { ATTR_FUNC } from '../constants/resize-handler';

export class Rectangle implements Shape {
    private rectangleSettings: RectangleSettings;

    constructor(private domRenderer: DomRendererService) {
    }

    public createElement(data: Map<string, string>, hostElement?: any): Element {
       return this.domRenderer.createSVGElement(TOOL_TAGNAMES.RECTANGLE, data);
    }

    public getRectangleConfig(event: MouseEvent, id: string): Map<string, string> {
        const dataMap: Map<string, string> = new Map();

        this.rectangleSettings = new RectangleSettings(event, id);

        Object.keys(RECTANGLE_ATTRS).forEach((attr: string) => {
        if (ATTR_FUNC[attr]) {
            ATTR_FUNC[attr](dataMap, RECTANGLE_ATTRS[attr], this.rectangleSettings);
        }
        });

        return dataMap;
    }
}
