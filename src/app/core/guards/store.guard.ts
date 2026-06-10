import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { StoreService } from '../services/store.service';

export const storeGuard: CanActivateFn = () => {
  const storeService = inject(StoreService);
  const router = inject(Router);

  if (storeService.selectedStore()) {
    return true;
  }

  return router.createUrlTree(['/loja']);
};
