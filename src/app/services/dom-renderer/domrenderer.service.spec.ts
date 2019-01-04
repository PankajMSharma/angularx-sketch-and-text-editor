import { TestBed, inject } from '@angular/core/testing';

import { DomRendererService } from './domrenderer.service';

describe('DomRendererService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DomRendererService]
    });
  });

  it('should be created', inject([DomRendererService], (service: DomRendererService) => {
    expect(service).toBeTruthy();
  }));

  it('should create SVG Elements', inject([DomRendererService], (service: DomRendererService) => {
    let rectangleAttr = new Map();
    rectangleAttr.set('x', '20');
    rectangleAttr.set('y', '20');
    rectangleAttr.set('height', '20');
    rectangleAttr.set('width', '20');
    let elem = service.createSVGElement('rect', rectangleAttr);
    expect(elem.tagName).toEqual('rect');
  }));
});
