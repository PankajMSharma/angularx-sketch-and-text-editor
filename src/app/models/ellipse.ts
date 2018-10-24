import { Shape } from './shape';
import { DomRendererService } from '../services/dom-renderer/domrenderer.service';
import { ELLIPSE_ATTRS, TOOL_TAGNAMES } from '../constants/namespace';
import { EllipseSettings } from './settings/ellipse-settings';
import { ShapeConfigGenerator } from '../services/shape-config-generator/shape-config-generator';

export class Ellipse implements Shape {
    private shapeConfigGenerator: ShapeConfigGenerator<Ellipse>;
    public settings: EllipseSettings;

    constructor(private domRenderer: DomRendererService) {
      this.shapeConfigGenerator = new ShapeConfigGenerator();
    }

    public createElement(shape: Shape, event: MouseEvent, id: string, hostElement?: any): Element {
      this.settings = new EllipseSettings(event, id);

      const attr: Map<string, string> = this.shapeConfigGenerator.getElementAttr(shape as Ellipse, ELLIPSE_ATTRS, event, id);

      return this.domRenderer.createSVGElement(TOOL_TAGNAMES.ELLIPSE, attr);
    }
}
