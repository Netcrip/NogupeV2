import { TestBed } from '@angular/core/testing';

import { ClaseService } from './clase.service';

describe('ClaseService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ClaseService = TestBed.get(ClaseService);
    expect(service).toBeTruthy();
  });
});
