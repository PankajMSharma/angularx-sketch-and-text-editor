import { Component, OnInit, HostListener, Input, Renderer2, ViewChild, ElementRef, OnDestroy, RendererFactory2 } from '@angular/core';
import { Subscription, Observable, ReplaySubject } from 'rxjs';
import { DrawingSettings } from '../models/settings/drawing-settings';
import { SelectService } from '../services/select.service';
import { TOOL_TAGNAMES } from '../constants/namespace';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { gobbleEvent } from '../utils/event.utils';
import { DomRendererService } from '../services/dom-renderer/domrenderer.service';
import { ShapeFactory } from '../models/shape-factory';
import { Rectangle } from '../models/rectangle';
import { Shape } from '../models/shape';
import { SVGEventHandlerService } from '../services/svg-event-handler/svg-event-handler.service';

@Component({
  selector: 'ng-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit, OnDestroy {
  @Input() selectedTool: ReplaySubject<string>;
  @ViewChild('svg') svg: ElementRef;
  private renderer: Renderer2;
  private currentTool: string;
  private elemInConstruction: Element;
  private drawSettings: DrawingSettings;
  private mouseMoveSubscription: Subscription;
  private mouseUpSubscription: Subscription;
  public selectedElements: Array<SVGElement> = [];

  constructor(private rendererFactory: RendererFactory2, private selectService: SelectService, private domRenderer: DomRendererService,
    private shapeFactory: ShapeFactory, private svgEventHandler: SVGEventHandlerService) {
    this.renderer = this.rendererFactory.createRenderer(null, null);
    this.drawSettings = DrawingSettings.getInstance();
   }

  ngOnInit() {
    this.selectedTool.subscribe(selectedTool => {
      if (selectedTool !== 'select') {
        this.clearSelection();
      }
      this.currentTool = selectedTool;
    });
  }

  /**
   * Delegates job as per the current tool like.. creating rectangle, ellipse, etc.
   * @param event
   */
  @HostListener('mousedown', ['$event'])
  public onMouseDown(event: MouseEvent) {
    gobbleEvent(event);

    switch (this.currentTool) {
      case 'rectangle': this.drawRectangle(event);
      break;
      case 'ellipse': this.drawEllipse(event);
      break;
      default: this.selectionMode(event);
      break;
    }
  }

  /**
   * Drags selected elements
   * @param event
   */
  private dragElements(event: MouseEvent): void {
    gobbleEvent(event);

    // check if element is selected
    if (this.isSelectedElement(event.target as Element)) {
      const position = { pos1: 0, pos2: 0, pos3: 0, pos4: 0 };

      // get the mouse cursor position at start
      position.pos1 = event.clientX;
      position.pos2 = event.clientY;

      if (this.mouseMoveSubscription && !this.mouseMoveSubscription.closed) {
        this.mouseMoveSubscription.unsubscribe();
      }

      this.mouseMoveSubscription = Observable.fromEvent(this.svg.nativeElement, 'mousemove').subscribe((moveEvent: MouseEvent) => {
        this.svgEventHandler.dragElements(event, moveEvent, position, this.selectedElements);
      });

      this.mouseUpSubscription = fromEvent(document, 'mouseup').subscribe((moveUp: MouseEvent) => {
        if (this.mouseMoveSubscription && !this.mouseMoveSubscription.closed) {
          this.mouseMoveSubscription.unsubscribe();
        }

      });
    }
  }

  /**
  * Checks if the given element is selected
  * @param elem
  */
  private isSelectedElement(elem: Element): boolean {
    return this.selectedElements.includes(elem as SVGElement) ? true : false;
  }

  private selectionMode(event: MouseEvent): void {
    Observable.fromEvent(this.getTargetElement(event), 'mouseup').subscribe((mouseUp: MouseEvent) => {
      if ((event.pageX === mouseUp.pageX) && (event.pageY === mouseUp.pageY)) {
        const target: HTMLElement = event.target as HTMLElement;

        if (target.tagName !== 'svg') {
          if (!event.ctrlKey) {
            // remove old selection box
            this.clearSelection();
          }

          // get Parent group Element
          const targetElement: SVGElement = this.getTargetElement(event);
          // get selection box
          const selectGroup: Element = this.selectService.getSelectionBox(event, targetElement as SVGGraphicsElement);
          // add selection box
          this.domRenderer.appendChild(this.svg.nativeElement, selectGroup);

          if (!this.isSelectedElement(targetElement)) {
            this.selectedElements.push(targetElement);
          }
        } else {
          // remove old selection box
          this.clearSelection();
        }
      }
    });
    this.dragElements(event);
  }

  /**
  * Removes selection box
  */
  public clearSelection(): void {
    if (this.selectService.selectionBoxGroup) {
      this.domRenderer.removeChild(this.svg.nativeElement, this.selectService.selectionBoxGroup);
    }

    this.selectService.selectionBoxGroup = null;
    this.selectedElements = [];
  }

  /**
  * Gets target element or the target group for event
  */
  private getTargetElement(event: MouseEvent): SVGElement {
    let currElem: Element = event.target as Element;
    let targetElem: Element = currElem;

    while (currElem.nodeName !== 'svg') {
      currElem = currElem.parentElement;

      if (currElem.nodeName === 'g') {
        targetElem = currElem;
      }
    }

    return targetElem as SVGElement;
  }

  /**
   * Listens to MouseUp event on this component.
   * @param event
   */
  @HostListener('mouseup', ['$event'])
  public onMouseUp(event: MouseEvent) {
    event.preventDefault();

    if (this.elemInConstruction) {
      this.elemInConstruction = null;

      if (this.mouseMoveSubscription && !this.mouseMoveSubscription.closed) {
        this.mouseMoveSubscription.unsubscribe();
      }

      if (this.mouseUpSubscription && !this.mouseUpSubscription.closed) {
        this.mouseUpSubscription.unsubscribe();
      }
    }
  }

  /**
   * Creates rectangle
   * @param event
   */
  private drawRectangle(event: MouseEvent): void {
    let x: number, y: number;

    if (!this.elemInConstruction) {
      const shape: Rectangle = this.shapeFactory.getShape(TOOL_TAGNAMES.RECTANGLE) as Rectangle;
      const elem: Element = shape.createElement(shape, event, this.generateElementId());
      this.elemInConstruction = elem;

      this.svg.nativeElement.append(this.elemInConstruction);
      x = +this.elemInConstruction.getAttribute('x');
      y = +this.elemInConstruction.getAttribute('y');
    }

    this.mouseMoveSubscription = Observable.fromEvent(this.svg.nativeElement, 'mousemove').subscribe((moveEvent: MouseEvent) => {
      if (this.elemInConstruction) {
        const width: number = moveEvent.clientX - x;
        const height: number = moveEvent.clientY - y;
        this.domRenderer.setAttribute(this.elemInConstruction, 'x', ((width > 0) ? x : moveEvent.clientX).toString());
        this.domRenderer.setAttribute(this.elemInConstruction, 'y', ((height > 0) ? y : moveEvent.clientY).toString());
        this.domRenderer.setAttribute(this.elemInConstruction, 'width', ((width > 0) ? width : (-1 * width)).toString());
        this.domRenderer.setAttribute(this.elemInConstruction, 'height', ((height > 0) ? height : (-1 * height)).toString());
      }
    });

    this.mouseUpSubscription = Observable.fromEvent(this.svg.nativeElement, 'mouseup').subscribe((UpEvent: MouseEvent) => {
      const width: number = UpEvent.clientX - x;
      const height: number = UpEvent.clientY - y;
      if ((!width || !height) && this.elemInConstruction) {
        this.domRenderer.removeChild(this.svg.nativeElement, this.elemInConstruction);
      }
    });
  }

  /**
   * Creates Ellipse
   * @param event
   */
  public drawEllipse(event: MouseEvent): void {
    let cx: number, cy: number;

    if (!this.elemInConstruction) {
      const shape: Shape = this.shapeFactory.getShape(TOOL_TAGNAMES.ELLIPSE);

      const elem: Element = shape.createElement(shape, event, this.generateElementId());

      this.elemInConstruction = elem;

      this.svg.nativeElement.append(this.elemInConstruction);

      cx = +this.elemInConstruction.getAttribute('cx');
      cy = +this.elemInConstruction.getAttribute('cy');
    }

    this.mouseMoveSubscription = Observable.fromEvent(this.svg.nativeElement, 'mousemove').subscribe((moveEvent: MouseEvent) => {
      if (this.elemInConstruction) {
      const rx: number = moveEvent.clientX - cx;
      const ry: number = moveEvent.clientY - cy;
      this.domRenderer.setAttribute(this.elemInConstruction, 'rx', ((rx > 0) ? rx : (-1 * rx)).toString());
      this.domRenderer.setAttribute(this.elemInConstruction, 'ry', ((ry > 0) ? ry : (-1 * ry)).toString());
      }
    });

    this.mouseUpSubscription = Observable.fromEvent(this.svg.nativeElement, 'mouseup').subscribe((UpEvent: MouseEvent) => {
      const rx: number = UpEvent.clientX - cx;
      const ry: number = UpEvent.clientY - cy;

      if ((!rx || !ry) && this.elemInConstruction) {
        this.domRenderer.removeChild(this.svg.nativeElement, this.elemInConstruction);
      } else {
        this.domRenderer.setAttribute(this.elemInConstruction, 'rx', ((rx > 0) ? rx : (-1 * rx)).toString());
        this.domRenderer.setAttribute(this.elemInConstruction, 'ry', ((ry > 0) ? ry : (-1 * ry)).toString());
      }
    });
  }

  /**
   * Generates id for SVG elements
   */
  private generateElementId(): string {
    this.drawSettings.elemId += 1;
    return 'svg_elem_' + this.drawSettings.elemId.toString();
  }

  ngOnDestroy() {
    if (this.mouseMoveSubscription && !this.mouseMoveSubscription.closed) {
      this.mouseMoveSubscription.unsubscribe();
    }

    if (this.mouseUpSubscription && !this.mouseUpSubscription.closed) {
      this.mouseUpSubscription.unsubscribe();
    }
  }
}
