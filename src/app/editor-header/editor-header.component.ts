import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { ToolState } from '../models/tool-state';
import { TOOLNAMES, getToolNames } from '../constants/namespace';

const DEFAULT_TOOL: string = 'select';

@Component({
  selector: 'ng-editor-header',
  templateUrl: './editor-header.component.html',
  styleUrls: ['./editor-header.component.css']
})
export class EditorHeaderComponent implements OnInit {
  @Input() editorTitle: string;
  @Output() selectedTool: EventEmitter<string> = new EventEmitter<string>();
  public toolsState: Array<ToolState> = new Array<ToolState>();
  public toolsNames: Array<string>;

  constructor() { }

  ngOnInit() {
    this.toolsNames = getToolNames();
    this.initializeTools();
    this.selectTool();
  }

  public initializeTools(): void {
    this.toolsNames.forEach((name: string) =>
      this.toolsState.push(name === TOOLNAMES.SELECT ? new ToolState(name, 'selected') : new ToolState(name, 'enabled')));
  }

  public selectTool(toolName?: string): void {
    if (toolName) {
      this.toolsState.forEach(tool => {
          tool.toolName === toolName ? tool.state = 'selected' : tool.state = 'enabled';
        });
    } else {
      this.toolsState.forEach(tool => tool.toolName === DEFAULT_TOOL ? tool.state = 'selected' : 'enabled');
    }

    switch (toolName) {
      case TOOLNAMES.RECTANGLE:
        this.selectedTool.emit(toolName);
        break;
      case TOOLNAMES.ELLIPSE:
        this.selectedTool.emit(toolName);
        break;
      case 'textEdit':
        this.selectedTool.emit(toolName);
        break;
      case 'fileUpload':
        this.selectedTool.emit(toolName);
        break;
      default:
        this.selectedTool.emit(DEFAULT_TOOL);
    }
  }

  public isSelectedTool(toolName: string): boolean {
    return this.toolsState.findIndex(tool => toolName === tool.toolName && tool.state === 'selected') === -1 ? false : true;
  }

  public isDisabled(toolName: string): boolean {
    return this.toolsState.findIndex(tool => toolName === tool.toolName && tool.state === 'disabled') === -1 ? false : true;
  }

}
