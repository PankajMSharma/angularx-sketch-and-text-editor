import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { ToolState } from '../models/tool-state';
import { TOOLNAME, TOOL_CONFIGS, getToolNames, ToolConfig, TooltipConfig } from '../constants/namespace';

const DEFAULT_TOOL: string = TOOLNAME.SELECT;

@Component({
  selector: 'ng-editor-header',
  templateUrl: './editor-header.component.html',
  styleUrls: ['./editor-header.component.css']
})
export class EditorHeaderComponent implements OnInit {
  @Input() editorTitle: string;
  @Output() selectedTool: EventEmitter<string> = new EventEmitter<string>();
  public toolConfigs: Array<ToolConfig> = TOOL_CONFIGS;
  public toolsNames: Array<string>;

  constructor() { }

  ngOnInit() {
    this.toolsNames = getToolNames();
    this.selectTool(DEFAULT_TOOL);
  }

  public selectTool(toolName?: string): void {
    if (!toolName) {return;}

    TOOL_CONFIGS.forEach(tool => tool.selected = tool.name.toLocaleLowerCase() === toolName.toLocaleLowerCase() && !tool.disabled)

    switch (toolName) {
      case TOOLNAME.RECTANGLE:
        this.selectedTool.emit(toolName);
        break;
      case TOOLNAME.ELLIPSE:
        this.selectedTool.emit(toolName);
        break;
      case TOOLNAME.TEXTBOX:
        //this.selectedTool.emit(toolName); // TODO: Uncomment when functionality is complete
        break;
      case TOOLNAME.FILE_UPLOAD:
        //this.selectedTool.emit(toolName); // TODO: Uncomment when functionlity is complete
        break;
      default:
        this.selectedTool.emit(DEFAULT_TOOL);
    }
  }

  getToolConfig(toolName: string): ToolConfig {
    return this.toolConfigs
    .find(tool => toolName.toLocaleLowerCase() === tool.name.toLocaleLowerCase());
  }

  getTooltipConfig(toolName: string): TooltipConfig {
    return this.getToolConfig(toolName).tooltipSettings;
  }

  public isSelectedTool(toolName: string): boolean {
    return TOOL_CONFIGS
    .findIndex(tool => toolName.toLocaleLowerCase() === tool.name.toLocaleLowerCase() && tool.selected) > -1;
  }

  public isDisabled(toolName: string): boolean {
    return TOOL_CONFIGS.findIndex(tool => toolName === tool.name && tool.disabled) > 1;
  }

}
