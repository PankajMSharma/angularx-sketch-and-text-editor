import { Component, OnInit, HostListener, Input, Renderer2, ViewChild, ElementRef, OnDestroy, RendererFactory2 } from '@angular/core';
import { Subscription, Observable, ReplaySubject } from 'rxjs';
import { DrawingSettings } from '../models/settings/drawing-settings';
import { SelectService } from '../services/select.service';
import { TOOL_TAGNAMES, TOOLNAME } from '../constants/namespace';
import { gobbleEvent } from '../utils/event.utils';
import { ShapeFactory } from '../models/shape-factory';
import { Rectangle } from '../models/rectangle';
import { Ellipse } from '../models/ellipse';
import { DrawVariables } from '../models/draw-variables';
import { DrawMouseSubscriptions } from '../models/draw-mouse-subscriptions';

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
  private drawSettings: DrawingSettings;
  private mouseMoveSubscription: Subscription;
  private mouseUpSubscription: Subscription;
  public selectedElements: Array<SVGElement> = [];

  constructor(
    private rendererFactory: RendererFactory2,
    private selectService: SelectService,
    private shapeFactory: ShapeFactory,
    private drawVariables: DrawVariables) {
    this.renderer = this.rendererFactory.createRenderer(null, null);
    this.drawSettings = DrawingSettings.getInstance();
   }

  ngOnInit() {
    this.selectedTool.subscribe(selectedTool => {
      if (selectedTool !== TOOLNAME.SELECT) {
        this.selectedElements = this.selectService.clearSelection(this.svg, this.selectedElements);
      }
      this.currentTool = selectedTool;
    });

    this.drawVariables.elementUnderContruction
    .subscribe(underContruction => {
      if (!underContruction && this.mouseMoveSubscription) {
        this.mouseMoveSubscription.unsubscribe();
      }
      if (!underContruction && this.mouseUpSubscription) {
        this.mouseUpSubscription.unsubscribe();
      }
    });
  }

  /**
   * Delegates job as per the current tool like.. creating rectangle, ellipse, etc.
   * @param event
   */
  @HostListener('mousedown', ['$event'])
  public onMouseDown(event: MouseEvent) {
    gobbleEvent(event);

    if (this.drawVariables.elementUnderContruction.value) {
      return;
    }

    switch (this.currentTool.toLocaleLowerCase()) {
      case TOOLNAME.RECTANGLE.toLocaleLowerCase(): this.drawRectangle(event);
      break;
      case TOOLNAME.ELLIPSE.toLocaleLowerCase(): this.drawEllipse(event);
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

    if (this.drawVariables.elementUnderContruction.value) {
      this.drawVariables.elementUnderContruction.next(null);

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
  private drawEllipse(event: MouseEvent): void {
    const shape: Ellipse = this.shapeFactory.getShape(TOOL_TAGNAMES.ELLIPSE) as Ellipse;

    const subscriptions: DrawMouseSubscriptions = shape.drawEllipse(event, this.mouseMoveSubscription, this.mouseUpSubscription,
                        this.generateElementId(), this.svg);

    this.mouseMoveSubscription = subscriptions.mouseMoveSubscription;
    this.mouseUpSubscription = subscriptions.mouseUpSubscription;
  }

  /**
   *
   * @param event
   */
  private drawRectangle(event: MouseEvent): void {
    const shape: Rectangle = this.shapeFactory.getShape(TOOL_TAGNAMES.RECTANGLE) as Rectangle;

    const subscriptions: DrawMouseSubscriptions = shape.drawRectangle(event, this.mouseMoveSubscription, this.mouseUpSubscription,
                        this.generateElementId(), this.svg);

    this.mouseMoveSubscription = subscriptions.mouseMoveSubscription;
    this.mouseUpSubscription = subscriptions.mouseUpSubscription;
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
