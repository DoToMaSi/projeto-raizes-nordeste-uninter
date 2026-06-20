import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';

import { LgpdService } from '../services/lgpd.service';

export const lgpdGuard: CanActivateFn = () => {
  const lgpdService = inject(LgpdService);
  return lgpdService.hasRequiredConsent();
};
