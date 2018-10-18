export interface Shape {
    createElement(shape: Shape, event: MouseEvent, id: String, hostElement?: any): Element;
}
