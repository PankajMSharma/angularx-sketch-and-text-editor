export class ToolState {
    public toolName: string;
    public enabled: boolean;

    constructor(public tool: string, private isEnabled: boolean) {
      this.toolName = tool;
      this.enabled = isEnabled;
    }
  }
