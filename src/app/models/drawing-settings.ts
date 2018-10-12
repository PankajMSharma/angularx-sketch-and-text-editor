export class DrawingSettings {
  private static instance: DrawingSettings;
  public elemId: number;
  public stroke: string;
  public fill: string;
  public strokeWidth: string;

  private constructor(id: number, stroke: string, fill: string, strokeWidth: string) {
    this.elemId = id;
    this.stroke = stroke;
    this.fill = fill;
    this.strokeWidth = strokeWidth;
  }

  public static getInstance(id?: number, stroke?: string, fill?: string, strokeWidth?: string): DrawingSettings {
    if (!this.instance) {
      this.instance = new DrawingSettings(id, stroke, fill, strokeWidth);
    }
    return this.instance;
  }
}
