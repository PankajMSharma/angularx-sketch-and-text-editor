import { Injectable, Renderer2, RendererFactory2, ElementRef } from '@angular/core';
import { NAMESPACE, RESIZE_HANDLERS, RESIZE_HANDLER_ATTRS, TOOL_TAGNAMES } from '../constants/namespace';
import { SelectorSettings } from '../models/settings/selector-settings';
import { RESIZE_HANDLERS_ATTR_FUNC, RESIZE_HANDLERS_POS_FUNCS } from '../constants/resize-handler';
import { DrawingSettings } from '../models/settings/drawing-settings';
import { DomRendererService } from './dom-renderer/domrenderer.service';
import { Subscription, Observable } from 'rxjs';
import { gobbleEvent } from '../utils/event.utils';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { Ellipse } from '../models/ellipse';
import { Rectangle } from '../models/rectangle';
import { ShapeFactory } from '../models/shape-factory';

@Injectable()
export class SelectService {
  private renderer: Renderer2;
  private selectorSettings: SelectorSettings = new SelectorSettings();
  private drawingSettings: DrawingSettings;
  private selectorGrpId: number = 0;
  private parentSelectorGrpId: number = 0;
  public selectionBoxGroup: SVGAElement;

  constructor(private rendererFactory2: RendererFactory2, private domRenderer: DomRendererService, private shapeFactory: ShapeFactory) {
    this.renderer = this.rendererFactory2.createRenderer(null, null);
  }

  public getSelectionBox(event: MouseEvent, targetElement: SVGGraphicsElement): Element {
    const bBox: SVGRect = targetElement.getBBox();

    const selectorGroup: Element = document.createElementNS(NAMESPACE.SVG, 'g');
    this.domRenderer.setAttribute(selectorGroup, 'display', 'inline');
    this.domRenderer.setAttribute(selectorGroup, 'id', this.generateSelectorGroupId());

    const selectDottedBox: Element = document.createElementNS(NAMESPACE.SVG, 'path');
    this.domRenderer.setAttribute(selectDottedBox, 'fill', this.selectorSettings.selectorBoxFill);
    this.domRenderer.setAttribute(selectDottedBox, 'stroke', this.selectorSettings.stroke);
    this.domRenderer.setAttribute(selectDottedBox, 'stroke-dasharray', '5, 5');
    this.domRenderer.setAttribute(selectDottedBox, 'style', 'pointer-events:none');

    this.drawingSettings = DrawingSettings.getInstance();
    const sOffset: number = +this.drawingSettings.strokeWidth / 2;
    const path: string = 'M' + (bBox.x - sOffset) + ',' + (bBox.y - sOffset)
    + 'L' + (bBox.x + bBox.width + sOffset) + ',' + (bBox.y - sOffset)
    + ',' + (bBox.x + bBox.width + sOffset) + ',' + (bBox.y + bBox.height + sOffset)
    + ',' + (bBox.x - sOffset) + ',' + (bBox.y + bBox.height + sOffset) + 'Z';
    this.domRenderer.setAttribute(selectDottedBox, 'd', path);
    this.renderer.appendChild(selectorGroup, selectDottedBox);

    if (event.ctrlKey) {
      this.selectionBoxGroup = this.selectionBoxGroup ? this.selectionBoxGroup : this.getParentSelectorGroup();
      // remove resize handler
      const resizeHandler: NodeListOf<Element> = this.selectionBoxGroup.getElementsByClassName('selectorHandlers');
      if (resizeHandler.length > 0) {
        this.domRenderer.setAttribute(resizeHandler.item(0), 'display', 'none');
      }

      this.renderer.appendChild(this.selectionBoxGroup, selectorGroup);
      return this.selectionBoxGroup;
    } else if (!event.ctrlKey) {

      this.renderer.appendChild(selectorGroup, this.getResizeHandler(bBox));
      this.selectionBoxGroup = this.getParentSelectorGroup();
      this.renderer.appendChild(this.selectionBoxGroup, selectorGroup);
    }

    return this.selectionBoxGroup;
  }

  private getParentSelectorGroup(): SVGAElement {
    const parentSelectorGroup: Element = document.createElementNS(NAMESPACE.SVG, 'g');
    this.domRenderer.setAttribute(parentSelectorGroup, 'id', this.generateParentSelectorGrpId());
    this.domRenderer.setAttribute(parentSelectorGroup, 'position', 'absolute');
    this.domRenderer.setAttribute(parentSelectorGroup, 'xmlns', NAMESPACE.XMLNS);
    this.domRenderer.setAttribute(parentSelectorGroup, 'xmlns:xlink', NAMESPACE.XLINK);
    return parentSelectorGroup as SVGAElement;
  }

  private getResizeHandler(bBox: SVGRect): Element {
    const handlerGroup: Element = document.createElementNS(NAMESPACE.SVG, 'g');
    this.domRenderer.setAttribute(handlerGroup, 'display', 'inline');
    this.domRenderer.setAttribute(handlerGroup, 'id', 'selectorHandlers');
    this.domRenderer.setAttribute(handlerGroup, 'class', 'selectorHandlers');

    const handlerAttr: Array<Map<string, string>> = this.getResizeHandlerConfig(bBox);
    handlerAttr.forEach((shapeAttrs: Map<string, string>) => {
      this.renderer.appendChild(handlerGroup, this.domRenderer.createSVGElement('circle', shapeAttrs));
    });

    return handlerGroup;
  }

  private getResizeHandlerConfig(bBox: SVGRect): Array<Map<string, string>> {
    const dataArr: Array<Map<string, string>> = new Array();
    let dataMap: Map<string, string>;

    Object.keys(RESIZE_HANDLERS).forEach((dir: string) => {
      dataMap = new Map();
      RESIZE_HANDLERS_POS_FUNCS[dir](dataMap, bBox);

      Object.keys(RESIZE_HANDLER_ATTRS).forEach((attr: string) => {
        if (RESIZE_HANDLERS_ATTR_FUNC[attr]) {
          RESIZE_HANDLERS_ATTR_FUNC[attr](dataMap, attr, this.selectorSettings, dir);
        }
      });
      dataArr.push(dataMap);
    });
    return dataArr;
  }

  /**
   * Sets new properties for dragged selector box
   * @param group
   * @param pos3
   * @param pos4
   */
  public dragSelectorBox(group: Element, pos3: number, pos4: number): void {
    if (group.getElementsByTagName('path')) {
      const path: SVGPathElement = group.getElementsByTagName('path')[0];
      const d: String = path.getAttribute('d');
      const dValues: number[] = d.match(/-*\d*(\.?\d+)/g).map(Number);
      const pathArr: number[] = [];

      for (let i = 0; i < dValues.length; i++) {
        pathArr.push((i % 2 === 0) ? (dValues[i] - pos3) : (dValues[i] - pos4));
      }

      const pathD: string = 'M' + pathArr[0] + ',' + pathArr[1] + 'L' + pathArr[2] + ',' + pathArr[3] + ',' + pathArr[4] + ',' + pathArr[5]
      + ',' + pathArr[6] + ',' + pathArr[7] + 'Z';

      this.domRenderer.setAttribute(path, 'd', pathD);
    }

    if (group.getElementsByTagName('g').length > 0) {
      const rh: NodeListOf<SVGCircleElement> = group.getElementsByTagName('g').item(0).getElementsByTagName('circle');

      Array.from(rh).forEach((elmnt: SVGCircleElement) => {
        this.domRenderer.setAttribute(elmnt, 'cx', (+elmnt.getAttribute('cx') - pos3).toString());
        this.domRenderer.setAttribute(elmnt, 'cy', (+elmnt.getAttribute('cy') - pos4).toString());
      });
    }
  }

  /**
   * Drags selected elements
   * @param event
   */
  public dragSelectedElements(event: MouseEvent, mouseMoveSubsc: Subscription, mouseUpSubsc: Subscription,
                              svg: ElementRef, selectedElements: Array<SVGElement>): void {

    let pos1: number = 0;
    let pos2: number = 0;
    let pos3: number = 0;
    let pos4: number = 0;

    // get the mouse cursor position at start
    pos1 = event.clientX;
    pos2 = event.clientY;

    if (mouseMoveSubsc && !mouseMoveSubsc.closed) {
      mouseMoveSubsc.unsubscribe();
    }

    mouseMoveSubsc = Observable.fromEvent(svg.nativeElement, 'mousemove').subscribe((moveEvent: MouseEvent) => {
      gobbleEvent(event);

      pos3 = pos1 - moveEvent.clientX;
      pos4 = pos2 - moveEvent.clientY;
      pos1 = moveEvent.clientX;
      pos2 = moveEvent.clientY;

      // drag for each selected element
      selectedElements.forEach((elem: SVGElement) => {
        switch (elem.tagName) {
          case 'ellipse': {
            const shape: Ellipse = this.shapeFactory.getShape(TOOL_TAGNAMES.ELLIPSE) as Ellipse;
            shape.dragEllipse(elem as SVGEllipseElement, pos3, pos4);
          }
          break;
          case 'rect': {
              const shape: Rectangle = this.shapeFactory.getShape(TOOL_TAGNAMES.RECTANGLE) as Rectangle;
              shape.dragRectangle(elem as SVGRectElement, pos3, pos4);
          }
          break;
        }
      });

      const selectorElems: HTMLCollection = this.selectionBoxGroup.children;

      for (let i = 0; i < selectorElems.length; i++) {
        this.dragSelectorBox(selectorElems[i], pos3, pos4);
      }
    });

    mouseUpSubsc = fromEvent(document, 'mouseup').subscribe((moveUp: MouseEvent) => {
      if (mouseMoveSubsc && !mouseMoveSubsc.closed) {
        mouseMoveSubsc.unsubscribe();
      }

    });
  }

  /**
  * Removes selection box
  */
 public clearSelection(svg: ElementRef, selectedElements: Array<SVGElement>): Array<SVGElement> {
  if (this.selectionBoxGroup) {
    this.renderer.removeChild(svg.nativeElement, this.selectionBoxGroup);
  }

  this.selectionBoxGroup = null;
  return new Array<SVGElement>();
}

  private generateParentSelectorGrpId(): string {
    this.parentSelectorGrpId += 1;
    return 'parentSelectorGroup_' + this.parentSelectorGrpId.toString();
  }

  private generateSelectorGroupId(): string {
    this.selectorGrpId += 1;
    return 'selectorGroup_' + this.selectorGrpId.toString();
  }
}
