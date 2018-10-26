import { Component, OnInit, HostListener, Input, Renderer2, ViewChild, ElementRef, OnDestroy, RendererFactory2 } from '@angular/core';
import { Subscription, Observable, ReplaySubject } from 'rxjs';
import { DrawingSettings } from '../models/settings/drawing-settings';
import { SelectService } from '../services/select.service';
import { TOOL_TAGNAMES, TOOLNAMES } from '../constants/namespace';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { gobbleEvent } from '../utils/event.utils';
import { DomRendererService } from '../services/dom-renderer/domrenderer.service';
import { ShapeFactory } from '../models/shape-factory';
import { Rectangle } from '../models/rectangle';
import { Shape } from '../models/shape';
import { Ellipse } from '../models/ellipse';

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
    private shapeFactory: ShapeFactory) {
    this.renderer = this.rendererFactory.createRenderer(null, null);
    this.drawSettings = DrawingSettings.getInstance();
   }

  ngOnInit() {
    this.selectedTool.subscribe(selectedTool => {
      if (selectedTool !== TOOLNAMES.SELECT) {
        this.selectedElements = this.selectService.clearSelection(this.svg, this.selectedElements);
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
      case TOOLNAMES.RECTANGLE: this.drawRectangle(event);
      break;
      case TOOLNAMES.ELLIPSE: this.drawEllipse(event);
      break;
      default: this.selectionMode(event);
      break;
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
            this.selectedElements = this.selectService.clearSelection(this.svg, this.selectedElements);
          }

          // get Parent group Element
          const targetElement: SVGElement = this.getTargetElement(event);
          // get selection box
          const selectGroup: Element = this.selectService.getSelectionBox(event, targetElement as SVGGraphicsElement);
          // add selection box
          this.renderer.appendChild(this.svg.nativeElement, selectGroup);

          if (!this.isSelectedElement(targetElement)) {
            this.selectedElements.push(targetElement);
          }
        } else {
          // remove old selection box
          this.selectedElements = this.selectService.clearSelection(this.svg, this.selectedElements);
        }
      }
    });
    if (this.isSelectedElement(event.target as Element)) {
      // check if element is selected
      this.selectService.dragSelectedElements(event, this.mouseMoveSubscription, this.mouseUpSubscription, this.svg, this.selectedElements);
    }
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
   *
   * @param event
   */
  private drawRectangle(event: MouseEvent): void {
    const shape: Rectangle = this.shapeFactory.getShape(TOOL_TAGNAMES.RECTANGLE) as Rectangle;

    shape.drawRectangle(event, this.elemInConstruction, this.mouseMoveSubscription, this.mouseUpSubscription,
                        this.generateElementId(), this.svg);
  }

  /**
   *
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
        this.renderer.removeChild(this.svg.nativeElement, this.elemInConstruction);
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
