export class ToolState {
    public toolName: string;
    public state: string; // 'selected', 'enabled', 'disabled'

    constructor(public tool: string, private toolState: string) {
      this.toolName = tool;
      this.state = toolState;
    }
  }
