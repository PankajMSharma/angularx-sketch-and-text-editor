import { Shape } from './shape';
import { DomRendererService } from '../services/dom-renderer/domrenderer.service';
import { ELLIPSE_ATTRS, TOOL_TAGNAMES } from '../constants/namespace';
import { ATTR_FUNC } from '../constants/resize-handler';
import { EllipseSettings } from './settings/ellipse-settings';

export class Ellipse implements Shape {
    private ellipseSettings: EllipseSettings;

    constructor(private domRenderer: DomRendererService) {
    }

    public createElement(data: Map<string, string>, hostElement?: any): Element {
       return this.domRenderer.createSVGElement(TOOL_TAGNAMES.ELLIPSE, data);
    }

    public getEllipseConfig(event: MouseEvent, id: string): Map<string, string> {
      const dataMap: Map<string, string> = new Map();

      this.ellipseSettings = new EllipseSettings(event, id);

      Object.keys(ELLIPSE_ATTRS).forEach((attr: string) => {
        if (ATTR_FUNC[attr]) {
          ATTR_FUNC[attr](dataMap, ELLIPSE_ATTRS[attr], this.ellipseSettings);
        }
      });

      return dataMap;
    }
}
