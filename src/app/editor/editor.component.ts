import { Component, OnInit, HostListener, Input, Renderer2, ViewChild, ElementRef,
  OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';

const NAMESPACE = {
  SVG: 'http://www.w3.org/2000/svg'
};

@Component({
  selector: 'ng-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit, OnChanges {
  @Input() selectedTool: string;
  @ViewChild('svg') svg: ElementRef;

  constructor(private renderer: Renderer2, private changeRef: ChangeDetectorRef) { }

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

  public drawRectangle(event: MouseEvent) {
    this.svg.nativeElement.addEventListener('mouseup', (event2: MouseEvent) => {
      const elem = document.createElementNS(NAMESPACE.SVG, 'rect');
      this.renderer.setAttribute(elem, 'x', event.clientX.toString());
      this.renderer.setAttribute(elem, 'y', event.clientY.toString());
      this.renderer.setAttribute(elem, 'width', event2.clientX.toString());
      this.renderer.setAttribute(elem, 'height', event2.clientX.toString());
      this.renderer.setAttribute(elem, 'stroke', 'black');
      this.renderer.setAttribute(elem, 'fill', 'none');
      this.renderer.setAttribute(elem, 'stroke-width', '4');
      this.renderer.setAttribute(elem, 'id', 'rectangle');
      console.log(elem.clientTop, '-', elem.clientWidth);
      this.svg.nativeElement.append(elem);
    });
  }

  public drawEllipse(event: MouseEvent) {

  }

  ngOnChanges(changes: SimpleChanges): void {
    this.changeRef.detectChanges();
  }

}
