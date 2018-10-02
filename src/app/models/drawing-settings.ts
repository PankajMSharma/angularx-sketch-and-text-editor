export class DrawingSettings {
    public elemId: number;
    public stroke: string;
    public fill: string;
    public strokeWidth: string;

    constructor(id: number, stroke: string, fill: string, strokeWidth: string) {
      this.elemId = id;
      this.stroke = stroke;
      this.fill = fill;
      this.strokeWidth = strokeWidth;
    }
}
