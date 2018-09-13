import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'ng-editor-header',
  templateUrl: './editor-header.component.html',
  styleUrls: ['./editor-header.component.css']
})
export class EditorHeaderComponent implements OnInit {
  @Input() editorTitle: string;
  public selectedTool: String;

  constructor() { }

  ngOnInit() {
    this.selectTool();
  }

  public selectTool(toolName?: string) {
    switch (toolName) {
      case 'rectangle':
        this.selectedTool = toolName;
        break;
      case 'circle':
        this.selectedTool = toolName;
        break;
      default:
        this.selectedTool = 'select';
    }
  }

}
