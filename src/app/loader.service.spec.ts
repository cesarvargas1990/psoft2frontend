import { TestBed } from '@angular/core/testing';
import { LoaderService } from './loader.service';

describe('LoaderService', () => {
  let service: LoaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.get(LoaderService);
  });

  it('deberia crearse', () => {
    expect(service).toBeTruthy();
  });

  it('deberia iniciar isLoading en false', () => {
    expect(service.isLoading.value).toBe(false);
  });

  it('deberia emitir nuevos valores en isLoading', () => {
    service.isLoading.next(true);
    expect(service.isLoading.value).toBe(true);
  });
});
