import { Shape } from './shape';
import { DomRendererService } from '../services/dom-renderer/domrenderer.service';
import { ELLIPSE_ATTRS, TOOL_TAGNAMES } from '../constants/namespace';
import { EllipseSettings } from './settings/ellipse-settings';
import { ShapeConfigGenerator } from '../services/shape-config-generator/shape-config-generator';
import { DrawVariables } from './draw-variables';
import { Observable, Subscription } from 'rxjs';
import { ElementRef } from '@angular/core';
import { DrawMouseSubscriptions } from './draw-mouse-subscriptions';

export class Ellipse implements Shape {
  private shapeConfigGenerator: ShapeConfigGenerator<Ellipse>;
  public settings: EllipseSettings;

  constructor(
    private domRenderer: DomRendererService,
    private drawVariables: DrawVariables) {

    this.shapeConfigGenerator = new ShapeConfigGenerator();
  }

  public createElement(shape: Shape, event: MouseEvent, id: string, svg: SVGElement, hostElement?: any): Element {
    this.settings = new EllipseSettings(event, id, svg);

    const attr: Map<string, string> = this.shapeConfigGenerator.getElementAttr(shape as Ellipse, ELLIPSE_ATTRS, event, id);

    return this.domRenderer.createSVGElement(TOOL_TAGNAMES.ELLIPSE, attr);
  }

  /**
   *
   * @param event
   */
  public drawEllipse(event: MouseEvent, mouseMoveSubscription: Subscription, mouseUpSubscription: Subscription,
    id: string, svg: ElementRef): DrawMouseSubscriptions {
    
    if (!!this.drawVariables.elementUnderContruction.value) {
        return;
    }

    let cx: number, cy: number;

    const elem: Element = this.createElement(this, event, id, svg.nativeElement);
    svg.nativeElement.append(elem);
    this.drawVariables.elementUnderContruction.next(elem);

    cx = +this.drawVariables.elementUnderContruction.value.getAttribute('cx');
    cy = +this.drawVariables.elementUnderContruction.value.getAttribute('cy');

    mouseMoveSubscription = Observable.fromEvent(svg.nativeElement, 'mousemove').subscribe((moveEvent: MouseEvent) => {
      if (this.drawVariables.elementUnderContruction.value) {
        const svgRect = svg.nativeElement.getBoundingClientRect();
        // Important to take into account the position of SVG
        const relativeMouseX = moveEvent.clientX - svgRect.left;
        const relativeMouseY = moveEvent.clientY - svgRect.top;

        const rx: number = relativeMouseX - cx;
        const ry: number = relativeMouseY - cy;
        this.domRenderer.setAttribute(this.drawVariables.elementUnderContruction.value, 'rx', Math.abs(rx).toString());
        this.domRenderer.setAttribute(this.drawVariables.elementUnderContruction.value, 'ry', Math.abs(ry).toString());
      }
    });

    mouseUpSubscription = Observable.fromEvent(svg.nativeElement, 'mouseup').subscribe((UpEvent: MouseEvent) => {
      const svgRect = svg.nativeElement.getBoundingClientRect();
      // Important to take into account the position of SVG
      const relativeMouseX = UpEvent.clientX - svgRect.left;
      const relativeMouseY = UpEvent.clientY - svgRect.top;
      const rx: number = relativeMouseX - cx;
      const ry: number = relativeMouseY - cy;

      if ((!rx || !ry) && this.drawVariables.elementUnderContruction.value) {
        this.domRenderer.removeChild(svg.nativeElement, this.drawVariables.elementUnderContruction.value);
      } else {
        this.domRenderer.setAttribute(this.drawVariables.elementUnderContruction.value, 'rx', Math.abs(rx).toString());
        this.domRenderer.setAttribute(this.drawVariables.elementUnderContruction.value, 'ry', Math.abs(ry).toString());
      }
    });

    return { mouseMoveSubscription, mouseUpSubscription };
  }

  /**
   * Sets new properties from dragged ellipse
   * @param elem
   * @param pos3
   * @param pos4
   */
  public dragEllipse (elem: SVGEllipseElement, pos3: number, pos4: number): void {
    // set the element's new position
    this.domRenderer.setAttribute(elem, 'cx', (+elem.getAttribute('cx') - pos3).toString());
    this.domRenderer.setAttribute(elem, 'cy', (+elem.getAttribute('cy') - pos4).toString());
  }
}
