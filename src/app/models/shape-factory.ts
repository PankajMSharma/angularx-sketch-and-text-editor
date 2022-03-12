import { Shape } from './shape';
import { Ellipse } from './ellipse';
import { Rectangle } from './rectangle';
import { Injectable } from '@angular/core';
import { DomRendererService } from '../services/dom-renderer/domrenderer.service';
import { TOOL_TAGNAMES } from '../constants/namespace';
import { DrawVariables } from './draw-variables';

@Injectable()
export class ShapeFactory {

    constructor(private domRenderer: DomRendererService, private drawVariables: DrawVariables) {}

    // use getShape method to get object of type shape
    public getShape(shapeType: string): Shape {
       if (shapeType == null) {
          return null;
       }
       if (shapeType === TOOL_TAGNAMES.ELLIPSE) {
          return new Ellipse(this.domRenderer, this.drawVariables);

       } else if (shapeType === TOOL_TAGNAMES.RECTANGLE) {
          return new Rectangle(this.domRenderer, this.drawVariables);
       }

       return null;
    }
}
