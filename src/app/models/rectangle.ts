import { Shape } from './shape';
import { RECTANGLE_ATTRS, TOOL_TAGNAMES } from '../constants/namespace';
import { DomRendererService } from '../services/dom-renderer/domrenderer.service';
import { RectangleSettings } from './settings/rectangle-settings';
import { ShapeConfigGenerator } from '../services/shape-config-generator/shape-config-generator';
import { ElementRef } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { DrawVariables } from './draw-variables';
import { DrawMouseSubscriptions } from './draw-mouse-subscriptions';

export class Rectangle implements Shape {
    private shapeConfigGenerator: ShapeConfigGenerator<Rectangle>;
    public settings: RectangleSettings;

    constructor(
        private domRenderer: DomRendererService,
        private drawVariables: DrawVariables) {

        this.shapeConfigGenerator = new ShapeConfigGenerator();
    }

    public createElement(shape: Shape, event: MouseEvent, id: string, svg: SVGElement, hostElement?: any): Element {
        this.settings = new RectangleSettings(event, id, svg);

        const attr: Map<string, string> = this.shapeConfigGenerator.getElementAttr(shape as Rectangle, RECTANGLE_ATTRS, event, id);

        return this.domRenderer.createSVGElement(TOOL_TAGNAMES.RECTANGLE, attr);
    }

    /**
   *
   * @param event
   */
    public drawRectangle(event: MouseEvent, mouseMoveSubscription: Subscription, mouseUpSubscription: Subscription,
                        id: string, svg: ElementRef): DrawMouseSubscriptions {

        let x: number, y: number;

        if (!!this.drawVariables.elementUnderContruction.value) {
            return;
        }

        const elem: Element = this.createElement(this, event, id, svg.nativeElement);
        this.drawVariables.elementUnderContruction.next(elem);

        svg.nativeElement.append(elem);
        x = +this.drawVariables.elementUnderContruction.value.getAttribute('x');
        y = +this.drawVariables.elementUnderContruction.value.getAttribute('y');

        mouseMoveSubscription = Observable.fromEvent(svg.nativeElement, 'mousemove').subscribe((moveEvent: MouseEvent) => {
            console.log("mouseMove");
            if (this.drawVariables.elementUnderContruction.value) {
                const svgRect = svg.nativeElement.getBoundingClientRect();
                // Important to take into account the position of SVG
                const relativeMouseX = moveEvent.clientX - svgRect.left;
                const relativeMouseY = moveEvent.clientY - svgRect.top;
                const relativeWidth: number = x - relativeMouseX;
                const relativeHeight: number = y - relativeMouseY;

                this.domRenderer.setAttribute(
                    this.drawVariables.elementUnderContruction.value, 'width', Math.abs(relativeWidth).toString());
                this.domRenderer.setAttribute(
                    this.drawVariables.elementUnderContruction.value, 'height', Math.abs(relativeHeight).toString());
                this.domRenderer.setAttribute(
                    this.drawVariables.elementUnderContruction.value, 'x', ((relativeMouseX < x) ? relativeMouseX : x).toString());
                this.domRenderer.setAttribute(
                    this.drawVariables.elementUnderContruction.value, 'y', ((relativeMouseY < y) ? relativeMouseY : y).toString());
            }
        });

        mouseUpSubscription = Observable.fromEvent(svg.nativeElement, 'mouseup').subscribe((UpEvent: MouseEvent) => {
            console.log("mouseUp");
            const width: number = UpEvent.clientX - x;
            const height: number = UpEvent.clientY - y;
            if ((!width || !height) && this.drawVariables.elementUnderContruction.value) {
                this.domRenderer.removeChild(svg.nativeElement, this.drawVariables.elementUnderContruction.value);
            }
            this.drawVariables.elementUnderContruction.next(null);
            
        });

        return { mouseMoveSubscription, mouseUpSubscription };
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
