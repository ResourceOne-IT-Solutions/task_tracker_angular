import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { adminGuard } from './admin.guard';

describe('adminGuard', () => {
  const executeGuard: CanActivateFn = () =>
    TestBed.runInInjectionContext(() => ({}) as any);
  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
