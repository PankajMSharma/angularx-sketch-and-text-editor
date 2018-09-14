import { Component, OnInit, Input } from '@angular/core';
import { ToolState } from '../models/tool-state';

@Component({
  selector: 'ng-editor-header',
  templateUrl: './editor-header.component.html',
  styleUrls: ['./editor-header.component.css']
})
export class EditorHeaderComponent implements OnInit {
  @Input() editorTitle: string;
  public selectedTool: String;
  public toolsState: Array<ToolState> = new Array<ToolState>();
  public toolsNames: Array<string> = new Array<string>('rectangle', 'ellipse', 'select', 'textEdit', 'fileUpload');

  constructor() { }

  ngOnInit() {
    this.initializeTools();
    this.selectTool();
  }

  public initializeTools() {
    this.toolsNames.forEach(name => this.toolsState.push(new ToolState(name, true)));
  }

  public selectTool(toolName?: string) {
    switch (toolName) {
      case 'rectangle':
        this.selectedTool = toolName;
        break;
      case 'ellipse':
        this.selectedTool = toolName;
        break;
      case 'textEdit':
        this.selectedTool = toolName;
        break;
      case 'fileUpload':
        this.selectedTool = toolName;
        break;
      default:
        this.selectedTool = 'select';
    }
  }

  public isSelectedTool(toolName: string) {
    return toolName === this.selectedTool;
  }

  public isDisabled(toolName: string) {
    return this.toolsState.findIndex(tool => toolName === tool.toolName) === -1 ? true : false;
  }

}
