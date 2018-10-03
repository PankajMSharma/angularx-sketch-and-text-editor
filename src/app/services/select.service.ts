import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';

const NAMESPACE = {
  SVG: 'http://www.w3.org/2000/svg'
};

@Injectable()
export class SelectService {
 private renderer: Renderer2;
 public selectionBox;

  constructor(private rendererFactory2: RendererFactory2) {
    this.renderer = this.rendererFactory2.createRenderer(null, null);
   }

  public selectElement(event): Element {
    const bBox = event.target.getBBox();
    const parentGroup = document.createElementNS(NAMESPACE.SVG, 'g');
    this.renderer.setAttribute(parentGroup, 'display', 'inline');
    this.renderer.setAttribute(parentGroup, 'id', 'selectorGroup_0');

    const selectBox = document.createElementNS(NAMESPACE.SVG, 'path');
    this.renderer.setAttribute(selectBox, 'fill', 'none');
    this.renderer.setAttribute(selectBox, 'stroke', '#22C');
    this.renderer.setAttribute(selectBox, 'stroke-dasharray', '5, 5');
    this.renderer.setAttribute(selectBox, 'style', 'pointer-events:none');
    const path = 'M' + (bBox.x - 0) + ' ' + (bBox.y - 0) + 'L' + (bBox.x + bBox.width + 0) + ' ' + (bBox.y - 0) + ' ' +
    (bBox.x + bBox.width + 0) + ' ' + (bBox.y + bBox.height + 0) + ' ' + (bBox.x - 0) + ' ' + (bBox.y + bBox.height + 0) + 'Z';
    this.renderer.setAttribute(selectBox, 'd', path);
    this.renderer.appendChild(parentGroup, selectBox);

    const handlerGroup = document.createElementNS(NAMESPACE.SVG, 'g');
    this.renderer.setAttribute(parentGroup, 'display', 'inline');

    let resizeHandler = document.createElementNS(NAMESPACE.SVG, 'circle');
    this.renderer.setAttribute(resizeHandler, 'id', 'selectorHandle_nw');
    this.renderer.setAttribute(resizeHandler, 'fill', '#22C');
    this.renderer.setAttribute(resizeHandler, 'stroke-width', '2');
    this.renderer.setAttribute(resizeHandler, 'r', '4');
    this.renderer.setAttribute(resizeHandler, 'style', 'cursor:nw-resize');
    this.renderer.setAttribute(resizeHandler, 'pointer-events', 'all');
    this.renderer.setAttribute(resizeHandler, 'cx', bBox.x.toString());
    this.renderer.setAttribute(resizeHandler, 'cy', bBox.y.toString());
    this.renderer.appendChild(handlerGroup, resizeHandler);

    resizeHandler = document.createElementNS(NAMESPACE.SVG, 'circle');
    this.renderer.setAttribute(resizeHandler, 'id', 'selectorHandle_n');
    this.renderer.setAttribute(resizeHandler, 'fill', '#22C');
    this.renderer.setAttribute(resizeHandler, 'stroke-width', '2');
    this.renderer.setAttribute(resizeHandler, 'r', '4');
    this.renderer.setAttribute(resizeHandler, 'style', 'cursor:n-resize');
    this.renderer.setAttribute(resizeHandler, 'pointer-events', 'all');
    this.renderer.setAttribute(resizeHandler, 'cx', (bBox.x + (bBox.width / 2)).toString());
    this.renderer.setAttribute(resizeHandler, 'cy', bBox.y.toString());
    this.renderer.appendChild(handlerGroup, resizeHandler);

    resizeHandler = document.createElementNS(NAMESPACE.SVG, 'circle');
    this.renderer.setAttribute(resizeHandler, 'id', 'selectorHandle_ne');
    this.renderer.setAttribute(resizeHandler, 'fill', '#22C');
    this.renderer.setAttribute(resizeHandler, 'stroke-width', '2');
    this.renderer.setAttribute(resizeHandler, 'r', '4');
    this.renderer.setAttribute(resizeHandler, 'style', 'cursor:ne-resize');
    this.renderer.setAttribute(resizeHandler, 'pointer-events', 'all');
    this.renderer.setAttribute(resizeHandler, 'cx', (bBox.x + bBox.width).toString());
    this.renderer.setAttribute(resizeHandler, 'cy', bBox.y.toString());
    this.renderer.appendChild(handlerGroup, resizeHandler);

    resizeHandler = document.createElementNS(NAMESPACE.SVG, 'circle');
    this.renderer.setAttribute(resizeHandler, 'id', 'selectorHandle_w');
    this.renderer.setAttribute(resizeHandler, 'fill', '#22C');
    this.renderer.setAttribute(resizeHandler, 'stroke-width', '2');
    this.renderer.setAttribute(resizeHandler, 'r', '4');
    this.renderer.setAttribute(resizeHandler, 'style', 'cursor:w-resize');
    this.renderer.setAttribute(resizeHandler, 'pointer-events', 'all');
    this.renderer.setAttribute(resizeHandler, 'cx', (bBox.x + bBox.width).toString());
    this.renderer.setAttribute(resizeHandler, 'cy', (bBox.y + (bBox.height / 2)).toString());
    this.renderer.appendChild(handlerGroup, resizeHandler);

    resizeHandler = document.createElementNS(NAMESPACE.SVG, 'circle');
    this.renderer.setAttribute(resizeHandler, 'id', 'selectorHandle_se');
    this.renderer.setAttribute(resizeHandler, 'fill', '#22C');
    this.renderer.setAttribute(resizeHandler, 'stroke-width', '2');
    this.renderer.setAttribute(resizeHandler, 'r', '4');
    this.renderer.setAttribute(resizeHandler, 'style', 'cursor:se-resize');
    this.renderer.setAttribute(resizeHandler, 'pointer-events', 'all');
    this.renderer.setAttribute(resizeHandler, 'cx', (bBox.x + bBox.width).toString());
    this.renderer.setAttribute(resizeHandler, 'cy', (bBox.y + bBox.height).toString());
    this.renderer.appendChild(handlerGroup, resizeHandler);

    resizeHandler = document.createElementNS(NAMESPACE.SVG, 'circle');
    this.renderer.setAttribute(resizeHandler, 'id', 'selectorHandle_s');
    this.renderer.setAttribute(resizeHandler, 'fill', '#22C');
    this.renderer.setAttribute(resizeHandler, 'stroke-width', '2');
    this.renderer.setAttribute(resizeHandler, 'r', '4');
    this.renderer.setAttribute(resizeHandler, 'style', 'cursor:s-resize');
    this.renderer.setAttribute(resizeHandler, 'pointer-events', 'all');
    this.renderer.setAttribute(resizeHandler, 'cx', (bBox.x + (bBox.width / 2)).toString());
    this.renderer.setAttribute(resizeHandler, 'cy', (bBox.y + bBox.height).toString());
    this.renderer.appendChild(handlerGroup, resizeHandler);

    resizeHandler = document.createElementNS(NAMESPACE.SVG, 'circle');
    this.renderer.setAttribute(resizeHandler, 'id', 'selectorHandle_sw');
    this.renderer.setAttribute(resizeHandler, 'fill', '#22C');
    this.renderer.setAttribute(resizeHandler, 'stroke-width', '2');
    this.renderer.setAttribute(resizeHandler, 'r', '4');
    this.renderer.setAttribute(resizeHandler, 'style', 'cursor:sw-resize');
    this.renderer.setAttribute(resizeHandler, 'pointer-events', 'all');
    this.renderer.setAttribute(resizeHandler, 'cx', bBox.x.toString());
    this.renderer.setAttribute(resizeHandler, 'cy', (bBox.y + bBox.height).toString());
    this.renderer.appendChild(handlerGroup, resizeHandler);

    resizeHandler = document.createElementNS(NAMESPACE.SVG, 'circle');
    this.renderer.setAttribute(resizeHandler, 'id', 'selectorHandle_e');
    this.renderer.setAttribute(resizeHandler, 'fill', '#22C');
    this.renderer.setAttribute(resizeHandler, 'stroke-width', '2');
    this.renderer.setAttribute(resizeHandler, 'r', '4');
    this.renderer.setAttribute(resizeHandler, 'style', 'cursor:e-resize');
    this.renderer.setAttribute(resizeHandler, 'pointer-events', 'all');
    this.renderer.setAttribute(resizeHandler, 'cx', bBox.x.toString());
    this.renderer.setAttribute(resizeHandler, 'cy', (bBox.y + (bBox.height / 2)).toString());
    this.renderer.appendChild(handlerGroup, resizeHandler);

    this.renderer.appendChild(parentGroup, handlerGroup);
    this.selectionBox = parentGroup;
    return parentGroup;
  }
}
