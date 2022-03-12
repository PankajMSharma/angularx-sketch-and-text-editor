import { TestBed, inject, async } from '@angular/core/testing';

import { SelectService } from './select.service';
import { NAMESPACE } from '../constants/namespace';
import { DomRendererService } from './dom-renderer/domrenderer.service';

describe('SelectService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SelectService, DomRendererService]
    });
  });

  it('should be created', inject([SelectService], (service: SelectService) => {
    expect(service).toBeTruthy();
  }));

  it('should get Selection Box', async(inject([SelectService], (service: SelectService) => {
    let elem = document.createElementNS(NAMESPACE.SVG, 'rect');
    elem.setAttribute('x', '20');
    elem.setAttribute('y', '20');
    elem.setAttribute('width', '20');
    elem.setAttribute('height', '20');
    let selectionBox = service.getSelectionBox(new MouseEvent('mousedown'), elem as SVGGraphicsElement);

    expect(selectionBox).toBeTruthy();
  })));
});
