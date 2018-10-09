import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { NAMESPACE } from '../constants/namespace';

const SELCTOR_OFFSET: number = 3;

@Injectable()
export class SelectService {
  private renderer: Renderer2;
  public selectionBoxGroup: SVGAElement;

  constructor(private rendererFactory2: RendererFactory2) {
    this.renderer = this.rendererFactory2.createRenderer(null, null);
  }

  public getSelectionBox(event: MouseEvent, targetElement: SVGGraphicsElement): Element {
    const bBox: SVGRect = targetElement.getBBox();

    const selectorGroup: Element = document.createElementNS(NAMESPACE.SVG, 'g');
    this.renderer.setAttribute(selectorGroup, 'display', 'inline');
    this.renderer.setAttribute(selectorGroup, 'id', 'selectorGroup_0');

    const selectDottedBox: Element = document.createElementNS(NAMESPACE.SVG, 'path');
    this.renderer.setAttribute(selectDottedBox, 'fill', 'none');
    this.renderer.setAttribute(selectDottedBox, 'stroke', '#22C');
    this.renderer.setAttribute(selectDottedBox, 'stroke-dasharray', '5, 5');
    this.renderer.setAttribute(selectDottedBox, 'style', 'pointer-events:none');
    const path: string = 'M' + (bBox.x - SELCTOR_OFFSET) + ',' + (bBox.y - SELCTOR_OFFSET)
    + 'L' + (bBox.x + bBox.width + SELCTOR_OFFSET) + ',' + (bBox.y - SELCTOR_OFFSET)
    + ',' + (bBox.x + bBox.width + SELCTOR_OFFSET) + ',' + (bBox.y + bBox.height + SELCTOR_OFFSET)
    + ',' + (bBox.x - SELCTOR_OFFSET) + ',' + (bBox.y + bBox.height + SELCTOR_OFFSET) + 'Z';
    this.renderer.setAttribute(selectDottedBox, 'd', path);
    this.renderer.appendChild(selectorGroup, selectDottedBox);

    if (event.ctrlKey) {
      this.selectionBoxGroup = this.selectionBoxGroup ? this.selectionBoxGroup : this.getParentSelectorGroup();
      // remove resize handler
      const resizeHandler: NodeListOf<Element> = this.selectionBoxGroup.getElementsByClassName('selectorHandlers');
      if (resizeHandler.length > 0) {
        this.selectionBoxGroup.firstChild.removeChild(resizeHandler[0]);
      }
      this.renderer.appendChild(this.selectionBoxGroup, selectorGroup);
    } else if (!event.ctrlKey) {
      this.renderer.appendChild(selectorGroup, this.getResizeHandler(bBox));
      this.selectionBoxGroup = this.getParentSelectorGroup();
      this.renderer.appendChild(this.selectionBoxGroup, selectorGroup);
    }

    return this.selectionBoxGroup;
  }

  private getParentSelectorGroup(): SVGAElement {
    const parentSelectorGroup: Element = document.createElementNS(NAMESPACE.SVG, 'g');
    this.renderer.setAttribute(parentSelectorGroup, 'id', 'parentSelectorGroup_0');
    this.renderer.setAttribute(parentSelectorGroup, 'position', 'absolute');
    this.renderer.setAttribute(parentSelectorGroup, 'xmlns', NAMESPACE.XMLNS);
    this.renderer.setAttribute(parentSelectorGroup, 'xmlns:xlink', NAMESPACE.XLINK);
    return parentSelectorGroup as SVGAElement;
  }

  private getResizeHandler(bBox: SVGRect): Element {
    const handlerGroup: Element = document.createElementNS(NAMESPACE.SVG, 'g');
    this.renderer.setAttribute(handlerGroup, 'display', 'inline');
    this.renderer.setAttribute(handlerGroup, 'id', 'selectorHandlers');
    this.renderer.setAttribute(handlerGroup, 'class', 'selectorHandlers');

    let resizeHandler: Element = document.createElementNS(NAMESPACE.SVG, 'circle');
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

    return handlerGroup;
  }
}
