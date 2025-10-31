import { TestBed } from '@angular/core/testing';

import { AlertaConfirmacionService } from './alerta-confirmacion-service';

describe('AlertaConfirmacionService', () => {
  let service: AlertaConfirmacionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlertaConfirmacionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
