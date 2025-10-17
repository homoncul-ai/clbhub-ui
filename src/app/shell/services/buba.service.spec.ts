import { TestBed } from '@angular/core/testing';

import { BubaService } from './buba.service';

describe('BubaService', () => {
  let service: BubaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BubaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
