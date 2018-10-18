import { ATTR_FUNC } from '../../constants/resize-handler';
import { Injectable } from '@angular/core';
import { Shape } from '../../models/shape';
import { EllipseSettings } from '../../models/settings/ellipse-settings';
import { RectangleSettings } from '../../models/settings/rectangle-settings';

/**
 * Generate SVG element attributes for EllipseSettings, RectangleSetings, etc.
 */
export class ShapeConfigGenerator<T> {
    private ATTRiBUTES = {};
    private settings;

    public getElementAttr(shape: Shape, event: MouseEvent, id: string): Map<string, string> {
      const dataMap: Map<string, string> = new Map();
      this.manageConfig(shape, event, id);

      Object.keys(this.ATTRiBUTES).forEach((attr: string) => {
        if (ATTR_FUNC[attr]) {
          ATTR_FUNC[attr](dataMap, this.ATTRiBUTES[attr], this.settings);
        }
      });

      return dataMap;
    }

    private manageConfig(shape: Shape, event: MouseEvent, id: string) {
      console.log('Shape is:-', shape.constructor.name);
      const settings =  new EllipseSettings(event, id);
      return settings;
    }
}

interface ShapeMap {
  'Ellipse': EllipseSettings;
  'Rectangle': RectangleSettings;
}
