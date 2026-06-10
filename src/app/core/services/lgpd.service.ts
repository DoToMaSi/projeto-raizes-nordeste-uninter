import { inject, Injectable, signal, computed } from '@angular/core';

import { LgpdConsent } from '../models/lgpd.model';

const LGPD_CONSENT_KEY = 'raizes_lgpd_consent';

@Injectable({ providedIn: 'root' })
export class LgpdService {
  readonly consent = signal<LgpdConsent | null>(this.loadConsent());

  readonly hasRequiredConsent = computed(
    () => this.consent()?.dataProcessing === true
  );

  acceptConsent(dataProcessing: boolean, marketing: boolean): void {
    const consent: LgpdConsent = {
      dataProcessing,
      marketing,
      acceptedAt: new Date().toISOString()
    };

    this.consent.set(consent);
    localStorage.setItem(LGPD_CONSENT_KEY, JSON.stringify(consent));
  }

  private loadConsent(): LgpdConsent | null {
    const stored = localStorage.getItem(LGPD_CONSENT_KEY);
    if (!stored) {
      return null;
    }

    try {
      return JSON.parse(stored) as LgpdConsent;
    } catch {
      return null;
    }
  }
}
