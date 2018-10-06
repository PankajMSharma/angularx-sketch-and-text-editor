import { Component, OnInit, HostListener, Input, Renderer2, ViewChild, ElementRef, OnDestroy, RendererFactory2 } from '@angular/core';
import { Subscription, Observable, ReplaySubject } from 'rxjs';
import { DrawingSettings } from '../models/drawing-settings';
import { SelectService } from '../services/select.service';
import { NAMESPACE } from '../constants/namespace';

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
  public selectedElements: Array<Element> = [];

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
    switch (this.currentTool) {
      case 'rectangle': this.drawRectangle(event);
      break;
      case 'ellipse': this.drawEllipse(event);
      break;
    }
  }

  @HostListener('click', ['$event'])
  public onMouseClick(event: MouseEvent) {
    if (this.currentTool === 'select') {
      this.selectionMode(event);
    }
  }

  private selectionMode(event) {
      this.selectedElements = [];
      if (event.target.tagName !== 'svg') {
        if (!event.ctrlKey) {
          // remove old selection box
          this.clearSelection();
        }
        // get Parent group Element
        this.getTargetElement(event);
        // get selection box
        const selectGroup: Element = this.selectService.getSelectionBox(event);
        // add selection box
        this.renderer.appendChild(this.svg.nativeElement, selectGroup);
      } else {
        // remove old selection box
        this.clearSelection();
      }
  }

  public clearSelection() {
    if (this.selectService.selectionBoxGroup) {
      this.renderer.removeChild(this.svg.nativeElement, this.selectService.selectionBoxGroup);
    }
    this.selectService.selectionBoxGroup = null;
  }

  private getTargetElement(event) {
    let currElem: Node = event.target;
    let targetElem = currElem;
    while (currElem.nodeName !== 'svg') {
      currElem = currElem.parentNode;
      if (currElem.nodeName === 'g') {
        targetElem = currElem;
      }
    }
    return targetElem;
  }

  @HostListener('mouseup', ['$event'])
  public onMouseUp(event: MouseEvent) {
    if (this.elemInConstruction) {
      this.elemInConstruction = null;
      this.mouseMoveSubscription.unsubscribe();
      this.mouseUpSubscription.unsubscribe();
    }
  }

  private drawRectangle(event: MouseEvent): void {
    let x: number;
    let y: number;
    if (!this.elemInConstruction) {
      const elem = document.createElementNS(NAMESPACE.SVG, 'rect');
      this.renderer.setAttribute(elem, 'x', event.clientX.toString());
      this.renderer.setAttribute(elem, 'y', event.clientY.toString());
      this.renderer.setAttribute(elem, 'stroke', this.drawSettings.stroke);
      this.renderer.setAttribute(elem, 'fill', this.drawSettings.fill);
      this.renderer.setAttribute(elem, 'stroke-width', this.drawSettings.strokeWidth);
      this.renderer.setAttribute(elem, 'id', this.generateElementId());
      this.renderer.setAttribute(elem, 'width', '0');
      this.renderer.setAttribute(elem, 'height', '0');
      this.elemInConstruction = elem;
      this.svg.nativeElement.append(this.elemInConstruction);
      x = +this.elemInConstruction.getAttribute('x');
      y = +this.elemInConstruction.getAttribute('y');
    }
    this.mouseMoveSubscription = Observable.fromEvent(this.svg.nativeElement, 'mousemove').subscribe((moveEvent: MouseEvent) => {
      if (this.elemInConstruction) {
      const width = moveEvent.clientX - x;
      const height = moveEvent.clientY - y;
      this.renderer.setAttribute(this.elemInConstruction, 'x', ((width > 0) ? x : moveEvent.clientX).toString());
      this.renderer.setAttribute(this.elemInConstruction, 'y', ((height > 0) ? y : moveEvent.clientY).toString());
      this.renderer.setAttribute(this.elemInConstruction, 'width', ((width > 0) ? width : (-1 * width)).toString());
      this.renderer.setAttribute(this.elemInConstruction, 'height', ((height > 0) ? height : (-1 * height)).toString());
      }
    });
    this.mouseUpSubscription = Observable.fromEvent(this.svg.nativeElement, 'mouseup').subscribe((UpEvent: MouseEvent) => {
      const width = UpEvent.clientX - x;
      const height = UpEvent.clientY - y;
      if ((!width || !height) && this.elemInConstruction) {
        this.renderer.removeChild(this.svg.nativeElement, this.elemInConstruction);
      }
    });
  }

  public drawEllipse(event: MouseEvent): void {
    let cx: number;
    let cy: number;
    if (!this.elemInConstruction) {
      const elem = document.createElementNS(NAMESPACE.SVG, 'ellipse');
      this.renderer.setAttribute(elem, 'cx', event.clientX.toString());
      this.renderer.setAttribute(elem, 'cy', event.clientY.toString());
      this.renderer.setAttribute(elem, 'stroke', this.drawSettings.stroke);
      this.renderer.setAttribute(elem, 'fill', this.drawSettings.fill);
      this.renderer.setAttribute(elem, 'stroke-width', this.drawSettings.strokeWidth);
      this.renderer.setAttribute(elem, 'id', this.generateElementId());
      this.renderer.setAttribute(elem, 'rx', '0');
      this.renderer.setAttribute(elem, 'ry', '0');
      this.elemInConstruction = elem;
      this.svg.nativeElement.append(this.elemInConstruction);
      cx = +this.elemInConstruction.getAttribute('cx');
      cy = +this.elemInConstruction.getAttribute('cy');
    }
    this.mouseMoveSubscription = Observable.fromEvent(this.svg.nativeElement, 'mousemove').subscribe((moveEvent: MouseEvent) => {
      if (this.elemInConstruction) {
      const rx = moveEvent.clientX - cx;
      const ry = moveEvent.clientY - cy;
      this.renderer.setAttribute(this.elemInConstruction, 'rx', ((rx > 0) ? rx : (-1 * rx)).toString());
      this.renderer.setAttribute(this.elemInConstruction, 'ry', ((ry > 0) ? ry : (-1 * ry)).toString());
      }
    });
    this.mouseUpSubscription = Observable.fromEvent(this.svg.nativeElement, 'mouseup').subscribe((UpEvent: MouseEvent) => {
      const rx = UpEvent.clientX - cx;
      const ry = UpEvent.clientY - cy;
      if ((!rx || !ry) && this.elemInConstruction) {
        this.renderer.removeChild(this.svg.nativeElement, this.elemInConstruction);
      } else {
        this.renderer.setAttribute(this.elemInConstruction, 'rx', ((rx > 0) ? rx : (-1 * rx)).toString());
        this.renderer.setAttribute(this.elemInConstruction, 'ry', ((ry > 0) ? ry : (-1 * ry)).toString());
      }
    });
  }

  private generateElementId(): string {
    this.drawSettings.elemId = this.drawSettings.elemId + 1;
    return 'svg_elem_' + this.drawSettings.elemId.toString();
  }

  ngOnDestroy() {
    if (!this.mouseMoveSubscription.closed) {
      this.mouseMoveSubscription.unsubscribe();
    }
    if (!this.mouseUpSubscription.closed) {
      this.mouseUpSubscription.unsubscribe();
    }
  }
}
