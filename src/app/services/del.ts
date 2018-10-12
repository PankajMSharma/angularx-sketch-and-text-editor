import { RESIZE_HANDLER_ATTRS, RESIZE_HANDLERS } from '../constants/namespace';

const CX = 'cx';
const CY = 'cy';

export const RESIZE_HANDLERS_FUNCTIONS = {
    NW: (dataMap, bBox) => {
        dataMap.set(CX, bBox.x.toString());
        dataMap.set(CY, bBox.y.toString());
    },
    N: (dataMap, bBox) => {
        dataMap.set(CX, (bBox.x + (bBox.width / 2)).toString());
        dataMap.set(CY, bBox.y.toString());
    },
    NE: (dataMap, bBox) => {
        dataMap.set(CX, (bBox.x + bBox.width).toString());
        dataMap.set(CY, bBox.y.toString());
    },
    E: (dataMap, bBox) => {
        dataMap.set(CX, bBox.x.toString());
        dataMap.set(CY, (bBox.y + (bBox.height / 2)).toString());
    },
    SE: (dataMap, bBox) => {
        dataMap.set(CX, (bBox.x + bBox.width).toString());
        dataMap.set(CY, (bBox.y + bBox.height).toString());
    },
    S: (dataMap, bBox) => {
        dataMap.set(CX, (bBox.x + (bBox.width / 2)).toString());
        dataMap.set(CY, (bBox.y + bBox.height).toString());
    },
    SW: (dataMap, bBox) => {
        dataMap.set(CX, bBox.x.toString());
          dataMap.set(CY, (bBox.y + bBox.height).toString());
    },
    W: (dataMap, bBox) => {
        dataMap.set(CX, (bBox.x + bBox.width).toString());
        dataMap.set(CY, (bBox.y + (bBox.height / 2)).toString());
    },
    FILL: (dataMap, bBox, attr) => {
        dataMap.set(RESIZE_HANDLER_ATTRS[attr], this.selectorSettings.circleFill);
    },
    STROKE_WIDTH: (dataMap, bBox, attr) => {
        dataMap.set(RESIZE_HANDLER_ATTRS[attr], this.selectorSettings.strokeWidth);
    },
    POINTER_EVENTS: (dataMap, bBox, attr) => {
        dataMap.set(RESIZE_HANDLER_ATTRS[attr], this.selectorSettings.pointerEvents);
    },
    CIRCLE_RADIUS: (dataMap, bBox, attr) => {
        dataMap.set(RESIZE_HANDLER_ATTRS[attr], this.selectorSettings.circleRadius);
    },
    ID: (dataMap, bBox, attr, dir?) => {
        dataMap.set(RESIZE_HANDLER_ATTRS[attr], 'selectorHandle_' + RESIZE_HANDLERS[dir]);
    },
    STYLE: (dataMap, bBox, attr, dir?) => {
        dataMap.set(RESIZE_HANDLER_ATTRS[attr], 'cursor:' + RESIZE_HANDLERS[dir] + '-resize');
    },
};
