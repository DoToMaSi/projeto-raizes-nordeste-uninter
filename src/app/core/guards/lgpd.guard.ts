import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { LgpdService } from '../services/lgpd.service';

export const lgpdGuard: CanActivateFn = () => {
  const lgpdService = inject(LgpdService);
  const router = inject(Router);

  if (lgpdService.hasRequiredConsent()) {
    return true;
  }

  return router.createUrlTree(['/']);
};
