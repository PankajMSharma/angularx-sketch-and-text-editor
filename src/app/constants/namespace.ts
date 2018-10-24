export const NAMESPACE = {
    SVG: 'http://www.w3.org/2000/svg',
    XMLNS: 'http://www.w3.org/2000/svg',
    XLINK: 'http://www.w3.org/1999/xlink'
  };

export const TOOL_TAGNAMES = {
  RECTANGLE: 'rect',
  ELLIPSE: 'ellipse'
};

export const RESIZE_HANDLERS = {
  NW: 'nw',
  N: 'n',
  NE: 'ne',
  E: 'e',
  SE: 'se',
  S: 's',
  SW: 'sw',
  W: 'w'
};

export const UNI_DRAW_SETTINGS = {
  ID: 0,
  STROKE: 'rgb(0, 0, 0)',
  STROKEWIDTH: '4',
  FILL: 'rgb(255, 255, 255)'
};

export const RESIZE_HANDLER_ATTRS = {
  ID: 'id',
  FILL: 'fill',
  STROKEWIDTH: 'stroke-Width',
  POINTEREVENTS: 'pointer-events',
  STYLE: 'style',
  CX: 'cx',
  CY: 'cy',
  R: 'r'
};

export const ELLIPSE_ATTRS = {
  ID: 'id',
  CX: 'cx',
  CY: 'cy',
  RX: 'rx',
  RY: 'ry',
  FILL: 'fill',
  STROKE: 'stroke',
  STROKEWIDTH: 'stroke-width',
  POSITION: 'position'
};

export const RECTANGLE_ATTRS = {
  ID: 'id',
  X: 'x',
  Y: 'y',
  WIDTH: 'width',
  HEIGHT: 'height',
  FILL: 'fill',
  STROKE: 'stroke',
  STROKEWIDTH: 'stroke-width',
  POSITION: 'position'
};

export const TOOLNAMES = {
  ELLIPSE: 'ELLIPSE',
  RECTANGLE: 'RECTANGLE',
  SELECT: 'SELECT'
};

/* export function constToArray(constant: Object) {
  const arr: Array<string>;
  for (key in constant) {
    if (key !== undefined) {
      arr.push(key);
    }
  }
  return arr;
} */
