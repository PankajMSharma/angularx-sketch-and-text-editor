import { Shape } from './shape';
import { Ellipse } from './ellipse';
import { Rectangle } from './rectangle';
import { Injectable } from '@angular/core';
import { DomRendererService } from '../services/dom-renderer/domrenderer.service';
import { TOOL_TAGNAMES } from '../constants/namespace';

@Injectable()
export class ShapeFactory {

    constructor(private domRenderer: DomRendererService) {}

    // use getShape method to get object of type shape
    public getShape(shapeType: string): Shape {
       if (shapeType == null) {
          return null;
       }
       if (shapeType === TOOL_TAGNAMES.ELLIPSE) {
          return new Ellipse(this.domRenderer);

       } else if (shapeType === TOOL_TAGNAMES.RECTANGLE) {
          return new Rectangle(this.domRenderer);
       }

       return null;
    }
}
