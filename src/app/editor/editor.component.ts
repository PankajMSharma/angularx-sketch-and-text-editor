import { Component, OnInit, HostListener, Input, Renderer2, ViewChild, ElementRef, OnDestroy, RendererFactory2 } from '@angular/core';
import { Subscription, Observable, ReplaySubject } from 'rxjs';
import { DrawingSettings } from '../models/drawing-settings';
import { SelectService } from '../services/select.service';
import { NAMESPACE } from '../constants/namespace';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { gobbleEvent } from '../utils/event.utils';
// import { killEvent } from '../utils/event.utils';

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

  constructor(private rendererFactory: RendererFactory2, private selectService: SelectService) {
    this.renderer = this.rendererFactory.createRenderer(null, null);
    this.drawSettings = new DrawingSettings(0, 'rgb(0, 0, 0)', 'white', '4');
   }

  ngOnInit() {
    this.selectedTool.subscribe(selectedTool => {
      if (selectedTool !== 'select') {
        this.clearSelection();
      }
      this.currentTool = selectedTool;
    });
  }

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

  private dragElements(event: MouseEvent): void {
    // check if element is selected
    if (this.isSelectedElement(event.target as Element)) {
      let pos1: number = 0;
      let pos2: number = 0;
      let pos3: number = 0;
      let pos4: number = 0;

      // get the mouse cursor position at start
      pos1 = event.clientX;
      pos2 = event.clientY;

      if (this.mouseMoveSubscription && !this.mouseMoveSubscription.closed) {
        this.mouseMoveSubscription.unsubscribe();
      }

      this.mouseMoveSubscription = Observable.fromEvent(this.svg.nativeElement, 'mousemove').subscribe((moveEvent: MouseEvent) => {
        gobbleEvent(event);

        pos3 = pos1 - moveEvent.clientX;
        pos4 = pos2 - moveEvent.clientY;
        pos1 = moveEvent.clientX;
        pos2 = moveEvent.clientY;

        // drag for each selected element
        this.selectedElements.forEach((elem: SVGElement) => {
          switch (elem.tagName) {
            case 'ellipse': this.dragEllipse(elem as SVGEllipseElement, pos3, pos4);
            break;
            case 'rect': this.dragRectangle(elem as SVGRectElement, pos3, pos4);
            break;
          }
        });

        const selectorElems: HTMLCollection = this.selectService.selectionBoxGroup.children;

        for (let i = 0; i < selectorElems.length; i++) {
          this.dragSelectorBox(selectorElems[i], pos3, pos4);
        }
      });

      this.mouseUpSubscription = fromEvent(document, 'mouseup').subscribe((moveUp: MouseEvent) => {
        if (this.mouseMoveSubscription && !this.mouseMoveSubscription.closed) {
          this.mouseMoveSubscription.unsubscribe();
        }

      });
    }
  }

  private dragSelectorBox(group: Element, pos3: number, pos4: number): void {
    if (group.getElementsByTagName('path')) {
      const path: SVGPathElement = group.getElementsByTagName('path')[0];
      const d: String = path.getAttribute('d');
      const dValues: number[] = d.match(/\d+(\.?\d+)/g).map(Number);
      const pathArr: number[] = [];

      for (let i = 0; i < dValues.length; i++) {
        pathArr.push((i % 2 === 0) ? (dValues[i] - pos3) : (dValues[i] - pos4));
      }

      const pathD: string = 'M' + pathArr[0] + ',' + pathArr[1] + 'L' + pathArr[2] + ',' + pathArr[3] + ',' + pathArr[4] + ',' + pathArr[5]
      + ',' + pathArr[6] + ',' + pathArr[7] + 'Z';

      this.renderer.setAttribute(path, 'd', pathD);
    }

    if (group.getElementsByTagName('g').length > 0) {
      const rh: NodeListOf<Element> = group.getElementsByTagName('g').item(0).getElementsByTagName('circle');

      for (let i = 0; i < rh.length; i++) {
        const elmnt = rh[i] as Element;
        this.renderer.setAttribute(elmnt, 'cx', (+elmnt.getAttribute('cx') - pos3).toString());
        this.renderer.setAttribute(elmnt, 'cy', (+elmnt.getAttribute('cy') - pos4).toString());
      }
    }
  }

  private dragEllipse (elem: SVGEllipseElement, pos3: number, pos4: number): void {
    // set the element's new position
    this.renderer.setAttribute(elem, 'cx', (+elem.getAttribute('cx') - pos3).toString());
    this.renderer.setAttribute(elem, 'cy', (+elem.getAttribute('cy') - pos4).toString());
  }

  private dragRectangle (elem: SVGRectElement, pos3: number, pos4: number): void {
    // set the element's new position
    this.renderer.setAttribute(elem, 'x', (+elem.getAttribute('x') - pos3).toString());
    this.renderer.setAttribute(elem, 'y', (+elem.getAttribute('y') - pos4).toString());
  }

  /**
  * Checks if the given element is selected
  *
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
          this.renderer.appendChild(this.svg.nativeElement, selectGroup);

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
      this.renderer.removeChild(this.svg.nativeElement, this.selectService.selectionBoxGroup);
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

  private drawRectangle(event: MouseEvent): void {
    let x: number, y: number;

    if (!this.elemInConstruction) {
      const elem: Element = document.createElementNS(NAMESPACE.SVG, 'rect');
      this.renderer.setAttribute(elem, 'x', event.clientX.toString());
      this.renderer.setAttribute(elem, 'y', event.clientY.toString());
      this.renderer.setAttribute(elem, 'stroke', this.drawSettings.stroke);
      this.renderer.setAttribute(elem, 'fill', this.drawSettings.fill);
      this.renderer.setAttribute(elem, 'stroke-width', this.drawSettings.strokeWidth);
      this.renderer.setAttribute(elem, 'id', this.generateElementId());
      this.renderer.setAttribute(elem, 'position', 'absolute');
      this.renderer.setAttribute(elem, 'width', '0');
      this.renderer.setAttribute(elem, 'height', '0');
      this.elemInConstruction = elem;
      this.svg.nativeElement.append(this.elemInConstruction);
      x = +this.elemInConstruction.getAttribute('x');
      y = +this.elemInConstruction.getAttribute('y');
    }

    this.mouseMoveSubscription = Observable.fromEvent(this.svg.nativeElement, 'mousemove').subscribe((moveEvent: MouseEvent) => {
      if (this.elemInConstruction) {
        const width: number = moveEvent.clientX - x;
        const height: number = moveEvent.clientY - y;
        this.renderer.setAttribute(this.elemInConstruction, 'x', ((width > 0) ? x : moveEvent.clientX).toString());
        this.renderer.setAttribute(this.elemInConstruction, 'y', ((height > 0) ? y : moveEvent.clientY).toString());
        this.renderer.setAttribute(this.elemInConstruction, 'width', ((width > 0) ? width : (-1 * width)).toString());
        this.renderer.setAttribute(this.elemInConstruction, 'height', ((height > 0) ? height : (-1 * height)).toString());
      }
    });

    this.mouseUpSubscription = Observable.fromEvent(this.svg.nativeElement, 'mouseup').subscribe((UpEvent: MouseEvent) => {
      const width: number = UpEvent.clientX - x;
      const height: number = UpEvent.clientY - y;
      if ((!width || !height) && this.elemInConstruction) {
        this.renderer.removeChild(this.svg.nativeElement, this.elemInConstruction);
      }
    });
  }

  public drawEllipse(event: MouseEvent): void {
    let cx: number, cy: number;

    if (!this.elemInConstruction) {
      const elem: Element = document.createElementNS(NAMESPACE.SVG, 'ellipse');
      this.renderer.setAttribute(elem, 'cx', event.clientX.toString());
      this.renderer.setAttribute(elem, 'cy', event.clientY.toString());
      this.renderer.setAttribute(elem, 'stroke', this.drawSettings.stroke);
      this.renderer.setAttribute(elem, 'fill', this.drawSettings.fill);
      this.renderer.setAttribute(elem, 'stroke-width', this.drawSettings.strokeWidth);
      this.renderer.setAttribute(elem, 'id', this.generateElementId());
      this.renderer.setAttribute(elem, 'position', 'absolute');
      this.renderer.setAttribute(elem, 'rx', '0');
      this.renderer.setAttribute(elem, 'ry', '0');
      this.elemInConstruction = elem;
      this.svg.nativeElement.append(this.elemInConstruction);
      cx = +this.elemInConstruction.getAttribute('cx');
      cy = +this.elemInConstruction.getAttribute('cy');
    }

    this.mouseMoveSubscription = Observable.fromEvent(this.svg.nativeElement, 'mousemove').subscribe((moveEvent: MouseEvent) => {
      if (this.elemInConstruction) {
      const rx: number = moveEvent.clientX - cx;
      const ry: number = moveEvent.clientY - cy;
      this.renderer.setAttribute(this.elemInConstruction, 'rx', ((rx > 0) ? rx : (-1 * rx)).toString());
      this.renderer.setAttribute(this.elemInConstruction, 'ry', ((ry > 0) ? ry : (-1 * ry)).toString());
      }
    });

    this.mouseUpSubscription = Observable.fromEvent(this.svg.nativeElement, 'mouseup').subscribe((UpEvent: MouseEvent) => {
      const rx: number = UpEvent.clientX - cx;
      const ry: number = UpEvent.clientY - cy;

      if ((!rx || !ry) && this.elemInConstruction) {
        this.renderer.removeChild(this.svg.nativeElement, this.elemInConstruction);
      } else {
        this.renderer.setAttribute(this.elemInConstruction, 'rx', ((rx > 0) ? rx : (-1 * rx)).toString());
        this.renderer.setAttribute(this.elemInConstruction, 'ry', ((ry > 0) ? ry : (-1 * ry)).toString());
      }
    });
  }

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
