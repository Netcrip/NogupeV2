import { TestBed } from '@angular/core/testing';

import { ListadoprofesorService } from './listadoprofesor.service';

describe('ListadoprofesorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ListadoprofesorService = TestBed.get(ListadoprofesorService);
    expect(service).toBeTruthy();
  });
});
