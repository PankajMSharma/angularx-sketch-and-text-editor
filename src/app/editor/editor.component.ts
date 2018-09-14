import { Component, OnInit, HostListener, Input } from '@angular/core';

@Component({
  selector: 'ng-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {
  @Input() selectedTool: string;

  constructor() { }

  ngOnInit() {
    alert(this.selectedTool);
  }

  @HostListener('mousedown')
  public onMouseDown(event: MouseEvent) {
    alert('hey');
  }

}
