import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { LgpdService } from '../../core/services/lgpd.service';

@Component({
  selector: 'app-lgpd-consent-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule],
  template: `
    @if (!lgpdService.hasRequiredConsent()) {
      <dialog class="modal modal-open" open>
        <div class="modal-box max-w-lg">
          <h2 class="text-lg font-bold">Privacidade e LGPD</h2>
          <p class="py-4 text-sm">
            Utilizamos seus dados para processar pedidos e melhorar sua experiência. Leia nossa
            política de privacidade e confirme seu consentimento para continuar.
          </p>

          <form class="flex flex-col gap-4" [formGroup]="form" (ngSubmit)="accept()">
            <label class="label cursor-pointer justify-start gap-3">
              <input
                type="checkbox"
                class="checkbox checkbox-primary min-h-11 min-w-11"
                formControlName="dataProcessing"
              />
              <span class="label-text">
                Autorizo o tratamento dos meus dados pessoais para processamento de pedidos
                <span class="text-error">*</span>
              </span>
            </label>

            <label class="label cursor-pointer justify-start gap-3">
              <input
                type="checkbox"
                class="checkbox checkbox-primary min-h-11 min-w-11"
                formControlName="marketing"
              />
              <span class="label-text">
                Desejo receber ofertas e novidades por e-mail (opcional)
              </span>
            </label>

            @if (form.controls.dataProcessing.touched && form.controls.dataProcessing.invalid) {
              <p class="text-error text-sm">O consentimento para tratamento de dados é obrigatório.</p>
            }

            <button
              type="submit"
              class="btn btn-primary min-h-11"
              [disabled]="form.controls.dataProcessing.invalid"
            >
              Aceitar e continuar
            </button>
          </form>
        </div>
      </dialog>
    }
  `
})
export class LgpdConsentModalComponent {
  protected readonly lgpdService = inject(LgpdService);
  private readonly fb = inject(FormBuilder);

  protected readonly form = this.fb.nonNullable.group({
    dataProcessing: [false, Validators.requiredTrue],
    marketing: [false]
  });

  protected readonly submitted = signal(false);

  accept(): void {
    this.submitted.set(true);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { dataProcessing, marketing } = this.form.getRawValue();
    this.lgpdService.acceptConsent(dataProcessing, marketing);
  }
}
