import { Component, OnInit, HostListener, Input, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { DrawingSettings } from '../models/drawing-settings';

const NAMESPACE = {
  SVG: 'http://www.w3.org/2000/svg'
};

@Component({
  selector: 'ng-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {
  @Input() selectedTool: string;
  @ViewChild('svg') svg: ElementRef;
  private elemInConstruction: Element;
  private drawSettings: DrawingSettings;
  private mouseMoveSubscription: Subscription;
  private mouseUpSubscription: Subscription;

  constructor(private renderer: Renderer2) {
    this.drawSettings = new DrawingSettings(0, 'rgb(0, 0, 0)', 'none', '4');
   }

  ngOnInit() {}

  @HostListener('mousedown', ['$event'])
  public onMouseDown(event: MouseEvent) {
    switch (this.selectedTool) {
      case 'rectangle': this.drawRectangle(event);
      break;
      case 'ellipse': this.drawEllipse(event);
      break;
    }
  }

  @HostListener('mouseup', ['$event'])
  public onMouseUp(event: MouseEvent) {
    if (this.elemInConstruction) {
      this.elemInConstruction = null;
      this.mouseMoveSubscription.unsubscribe();
      this.mouseUpSubscription.unsubscribe();
    }
  }

  public drawRectangle(event: MouseEvent): void {
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
      this.mouseMoveSubscription = Observable.fromEvent(this.svg.nativeElement, 'mousemove').subscribe((event:MouseEvent) => {
        let width = event.clientX - x;
        let height = event.clientY - y;
        this.renderer.setAttribute(this.elemInConstruction, 'x', ((width > 0) ? x : event.clientX).toString());
        this.renderer.setAttribute(this.elemInConstruction, 'y', ((height > 0) ? y : event.clientY).toString());
        this.renderer.setAttribute(this.elemInConstruction, 'width', ((width > 0) ? width : (-1 * width)).toString());
        this.renderer.setAttribute(this.elemInConstruction, 'height', ((height > 0) ? height : (-1 * height)).toString());
      });
      this.mouseUpSubscription = Observable.fromEvent(this.svg.nativeElement, 'mouseup').subscribe((event:MouseEvent) => {
        let width = event.clientX - x;
        let height = event.clientY - y;
        if (!width || !height) {
          this.renderer.removeChild(this.svg.nativeElement, this.elemInConstruction);
        } else {
          this.renderer.setAttribute(this.elemInConstruction, 'x', ((width > 0) ? x : event.clientX).toString());
          this.renderer.setAttribute(this.elemInConstruction, 'y', ((height > 0) ? y : event.clientY).toString());
          this.renderer.setAttribute(this.elemInConstruction, 'width', ((width > 0) ? width : (-1 * width)).toString());
          this.renderer.setAttribute(this.elemInConstruction, 'height', ((height > 0) ? height : (-1 * height)).toString());
        }
      });
  }

  public drawEllipse(event: MouseEvent): void {

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
