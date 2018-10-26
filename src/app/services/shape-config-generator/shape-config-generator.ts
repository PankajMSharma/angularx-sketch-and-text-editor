import { ATTR_FUNC } from '../../constants/resize-handler';
import { Shape } from '../../models/shape';
import { Ellipse } from '../../models/ellipse';

/**
 * Generate SVG element attributes for Ellipse, Rectangle, etc.
 */
export class ShapeConfigGenerator<T extends Shape> {

    public getElementAttr(shape: T, attrs: any, event: MouseEvent, id: string): Map<string, string> {
      const dataMap: Map<string, string> = new Map();

      Object.keys(attrs).forEach((attr: string) => {
        if (ATTR_FUNC[attr]) {
          ATTR_FUNC[attr](dataMap, attrs[attr], shape.settings);
        }
      });

      return dataMap;
    }
}
