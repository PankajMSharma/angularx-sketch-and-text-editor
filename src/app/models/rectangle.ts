import { Shape } from './shape';
import { RECTANGLE_ATTRS, TOOL_TAGNAMES } from '../constants/namespace';
import { DomRendererService } from '../services/dom-renderer/domrenderer.service';
import { RectangleSettings } from './settings/rectangle-settings';
import { ShapeConfigGenerator } from '../services/shape-config-generator/shape-config-generator';
import { ElementRef } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

export class Rectangle implements Shape {
    private shapeConfigGenerator: ShapeConfigGenerator<Rectangle>;
    public settings: RectangleSettings;

    constructor(private domRenderer: DomRendererService) {
        this.shapeConfigGenerator = new ShapeConfigGenerator();
    }

    public createElement(shape: Shape, event: MouseEvent, id: string, hostElement?: any): Element {
        this.settings = new RectangleSettings(event, id);

        const attr: Map<string, string> = this.shapeConfigGenerator.getElementAttr(shape as Rectangle, RECTANGLE_ATTRS, event, id);

        return this.domRenderer.createSVGElement(TOOL_TAGNAMES.RECTANGLE, attr);
    }

      /**
   *
   * @param event
   */
    public drawRectangle(event: MouseEvent, elemInConstruction: Element, mouseMoveSubsc: Subscription, mouseUpSubsc: Subscription,
                        id: string, svg: ElementRef): void {

        let x: number, y: number;

        if (!elemInConstruction) {
            const elem: Element = this.createElement(this, event, id);
            elemInConstruction = elem;

            svg.nativeElement.append(elemInConstruction);
            x = +elemInConstruction.getAttribute('x');
            y = +elemInConstruction.getAttribute('y');
        }

        mouseMoveSubsc = Observable.fromEvent(svg.nativeElement, 'mousemove').subscribe((moveEvent: MouseEvent) => {
            if (elemInConstruction) {
            const width: number = moveEvent.clientX - x;
            const height: number = moveEvent.clientY - y;
            this.domRenderer.setAttribute(elemInConstruction, 'x', ((width > 0) ? x : moveEvent.clientX).toString());
            this.domRenderer.setAttribute(elemInConstruction, 'y', ((height > 0) ? y : moveEvent.clientY).toString());
            this.domRenderer.setAttribute(elemInConstruction, 'width', ((width > 0) ? width : (-1 * width)).toString());
            this.domRenderer.setAttribute(elemInConstruction, 'height', ((height > 0) ? height : (-1 * height)).toString());
            }
        });

        mouseUpSubsc = Observable.fromEvent(svg.nativeElement, 'mouseup').subscribe((UpEvent: MouseEvent) => {
            const width: number = UpEvent.clientX - x;
            const height: number = UpEvent.clientY - y;
            if ((!width || !height) && elemInConstruction) {
            this.domRenderer.removeChild(svg.nativeElement, elemInConstruction);
            }
        });
    }

   /**
   * Sets new properties from dragged rectangle
   * @param elem
   * @param pos3
   * @param pos4
   */
    public dragRectangle(elem: SVGRectElement, pos3: number, pos4: number): void {
    // set the element's new position
    this.domRenderer.setAttribute(elem, 'x', (+elem.getAttribute('x') - pos3).toString());
    this.domRenderer.setAttribute(elem, 'y', (+elem.getAttribute('y') - pos4).toString());
    }
}
