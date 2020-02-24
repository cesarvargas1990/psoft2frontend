import { TestBed } from '@angular/core/testing';

import { TipodocidentiService } from './tipodocidenti.service';

describe('TipodocidentiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TipodocidentiService = TestBed.get(TipodocidentiService);
    expect(service).toBeTruthy();
  });
});
