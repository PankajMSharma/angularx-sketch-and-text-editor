import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { NAMESPACE, RESIZE_HANDLERS, RESIZE_HANDLER_ATTRS } from '../constants/namespace';
import { SelectorSettings } from '../models/selector-settings';
import { RESIZE_HANDLERS_ATTR_FUNC, RESIZE_HANDLERS_POS_FUNCS } from '../constants/resize-handler';
import { DrawingSettings } from '../models/drawing-settings';

@Injectable()
export class SelectService {
  private renderer: Renderer2;
  private selectorSettings: SelectorSettings = new SelectorSettings();
  private drawingSettings: DrawingSettings;
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
    this.renderer.setAttribute(selectDottedBox, 'fill', this.selectorSettings.selectorBoxFill);
    this.renderer.setAttribute(selectDottedBox, 'stroke', this.selectorSettings.stroke);
    this.renderer.setAttribute(selectDottedBox, 'stroke-dasharray', '5, 5');
    this.renderer.setAttribute(selectDottedBox, 'style', 'pointer-events:none');

    this.drawingSettings = DrawingSettings.getInstance();
    const sOffset: number = +this.drawingSettings.strokeWidth / 2;
    const path: string = 'M' + (bBox.x - sOffset) + ',' + (bBox.y - sOffset)
    + 'L' + (bBox.x + bBox.width + sOffset) + ',' + (bBox.y - sOffset)
    + ',' + (bBox.x + bBox.width + sOffset) + ',' + (bBox.y + bBox.height + sOffset)
    + ',' + (bBox.x - sOffset) + ',' + (bBox.y + bBox.height + sOffset) + 'Z';
    this.renderer.setAttribute(selectDottedBox, 'd', path);
    this.renderer.appendChild(selectorGroup, selectDottedBox);

    if (event.ctrlKey) {
      this.selectionBoxGroup = this.selectionBoxGroup ? this.selectionBoxGroup : this.getParentSelectorGroup();
      // remove resize handler
      const resizeHandler: NodeListOf<Element> = this.selectionBoxGroup.getElementsByClassName('selectorHandlers');
      if (resizeHandler.length > 0) {
        this.renderer.setAttribute(resizeHandler[0], 'display', 'none');
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

    const handlerAttr: Array<Map<string, string>> = this.getResizeHandlerConfig(bBox);
    handlerAttr.forEach((shapeAttrs: Map<string, string>) => {
      this.renderer.appendChild(handlerGroup, this.createSVGElement('circle', shapeAttrs));
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

  private createSVGElement(tagName: string, data: Map<string, string>): Element {
    const shape: Element = document.createElementNS(NAMESPACE.SVG, tagName);
    data.forEach((value: string, key: string) => {
      this.renderer.setAttribute(shape, key, value);
    });
    return shape;
  }
}
