import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from '../services/auth.service';
import { StoreService } from '../services/store.service';

export const homeRedirectGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const storeService = inject(StoreService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    return router.createUrlTree(['/auth/login']);
  }

  if (!storeService.selectedStore()) {
    return router.createUrlTree(['/loja']);
  }

  return router.createUrlTree(['/cardapio']);
};
