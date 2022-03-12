import { TOOLTIP_ACCEPTED_POSITIONS } from "../directive/tooltip-directive";

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

export const TOOLNAME = {
  ELLIPSE: 'ELLIPSE',
  RECTANGLE: 'RECTANGLE',
  SELECT: 'SELECT',
  TEXTBOX: 'TEXTBOX',
  FILE_UPLOAD: 'FILE_UPLOAD'
};

export const TOOL_CONFIGS: ToolConfig[] = [
  {name: TOOLNAME.ELLIPSE, selected: false, disabled: false, 
    tooltipSettings: {text: 'Ellipse', delay: 500, position: 'auto'}
  },
  {name: TOOLNAME.RECTANGLE, selected: true, disabled: false,
    tooltipSettings: {text: 'Rectangle', delay: 500, position: 'auto'}
  },
  {name: TOOLNAME.SELECT, selected: false, disabled: false,
    tooltipSettings: {text: 'Select', delay: 500, position: 'auto'}
  },
  {name: TOOLNAME.TEXTBOX, selected: false, disabled: true,
    tooltipSettings: {text: 'Textbox', delay: 500, position: 'auto'}
  },
  {name: TOOLNAME.FILE_UPLOAD, selected: false, disabled: true,
    tooltipSettings: {text: 'File upload', delay: 500, position: 'auto'}
  },
];

export function getToolNames() {
  return TOOL_CONFIGS.map(tool => tool.name);
}

export interface ToolConfig {
  name: string;
  selected?: boolean;
  disabled?: boolean;
  tooltipSettings?: TooltipConfig
}

export interface TooltipConfig {
  text: string;
  delay: number;
  position: TOOLTIP_ACCEPTED_POSITIONS;
}