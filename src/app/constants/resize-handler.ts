import { RESIZE_HANDLER_ATTRS, RESIZE_HANDLERS } from '../constants/namespace';
import { SelectorSettings } from '../models/settings/selector-settings';

const CX = 'cx';
const CY = 'cy';

export const RESIZE_HANDLERS_POS_FUNCS = {
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
    }
};

export const RESIZE_HANDLERS_ATTR_FUNC = {
    FILL: (dataMap: Map<string, string>, attr: string, setting: SelectorSettings, dir?: string) => {
        dataMap.set(RESIZE_HANDLER_ATTRS[attr], setting.circleFill);
    },
    STROKEWIDTH: (dataMap: Map<string, string>, attr: string, setting: SelectorSettings, dir?: string) => {
        dataMap.set(RESIZE_HANDLER_ATTRS[attr], setting.strokeWidth);
    },
    POINTEREVENTS: (dataMap: Map<string, string>, attr: string, setting: SelectorSettings, dir?: string) => {
        dataMap.set(RESIZE_HANDLER_ATTRS[attr], setting.pointerEvents);
    },
    R: (dataMap: Map<string, string>, attr: string, setting: SelectorSettings, dir?: string) => {
        dataMap.set(RESIZE_HANDLER_ATTRS[attr], setting.circleRadius);
    },
    ID: (dataMap: Map<string, string>, attr: string, setting?: SelectorSettings, dir?: string) => {
        dataMap.set(RESIZE_HANDLER_ATTRS[attr], 'selectorHandle_' + RESIZE_HANDLERS[dir]);
    },
    STYLE: (dataMap: Map<string, string>, attr: string, setting?: SelectorSettings, dir?: string) => {
        dataMap.set(RESIZE_HANDLER_ATTRS[attr], 'cursor:' + RESIZE_HANDLERS[dir] + '-resize');
    }
};

export const ATTR_FUNC = {
    ID: (dataMap: Map<string, string>, attr: string, setting?: any, dir?: string) => {
        dataMap.set(attr, setting.id);
    },
    X: (dataMap: Map<string, string>, attr: string, setting: any, dir?: string) => {
        dataMap.set(attr, setting.x);
    },
    Y: (dataMap: Map<string, string>, attr: string, setting: any, dir?: string) => {
        dataMap.set(attr, setting.y);
    },
    CX: (dataMap: Map<string, string>, attr: string, setting: any, dir?: string) => {
        dataMap.set(attr, setting.cx);
    },
    CY: (dataMap: Map<string, string>, attr: string, setting: any, dir?: string) => {
        dataMap.set(attr, setting.cy);
    },
    RX: (dataMap: Map<string, string>, attr: string, setting: any, dir?: string) => {
        dataMap.set(attr, setting.rx);
    },
    RY: (dataMap: Map<string, string>, attr: string, setting: any, dir?: string) => {
        dataMap.set(attr, setting.rx);
    },
    WIDTH: (dataMap: Map<string, string>, attr: string, setting: any, dir?: string) => {
        dataMap.set(attr, setting.width);
    },
    HEIGHT: (dataMap: Map<string, string>, attr: string, setting: any, dir?: string) => {
        dataMap.set(attr, setting.height);
    },
    POSITION: (dataMap: Map<string, string>, attr: string, setting: any, dir?: string) => {
        dataMap.set(attr, setting.position);
    },
    FILL: (dataMap: Map<string, string>, attr: string, setting: any, dir?: string) => {
        dataMap.set(attr, setting.fill);
    },
    STROKE: (dataMap: Map<string, string>, attr: string, setting: any, dir?: string) => {
        dataMap.set(attr, setting.stroke);
    },
    STROKEWIDTH: (dataMap: Map<string, string>, attr: string, setting: any, dir?: string) => {
        dataMap.set(attr, setting.strokeWidth);
    },
    POINTEREVENTS: (dataMap: Map<string, string>, attr: string, setting: any, dir?: string) => {
        dataMap.set(attr, setting.pointerEvents);
    },
    R: (dataMap: Map<string, string>, attr: string, setting: any, dir?: string) => {
        dataMap.set(attr, setting.circleRadius);
    },
    STYLE: (dataMap: Map<string, string>, attr: string, setting?: any, dir?: string) => {
        dataMap.set(attr, 'cursor:' + dir + '-resize');
    }
};
