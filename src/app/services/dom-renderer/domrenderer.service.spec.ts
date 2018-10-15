import { TestBed, inject } from '@angular/core/testing';

import { DomrendererService } from './domrenderer.service';

describe('DomrendererService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DomrendererService]
    });
  });

  it('should be created', inject([DomrendererService], (service: DomrendererService) => {
    expect(service).toBeTruthy();
  }));
});
