import { TestBed, inject } from '@angular/core/testing';

import { LoadingbarService } from './loading-bar.service';

describe('LoadingBarService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoadingbarService]
    });
  });

  it('should be created', inject([LoadingbarService], (service: LoadingbarService) => {
    expect(service).toBeTruthy();
  }));
});
