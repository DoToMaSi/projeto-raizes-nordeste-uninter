import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';
import { LoyaltyService } from '../../core/services/loyalty.service';
import { PrivacyService } from '../../core/services/privacy.service';

@Component({
  selector: 'app-account-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CurrencyPipe],
  template: `
    <div class="flex flex-col gap-6">
      <div>
        <h1 class="text-2xl font-bold">Minha conta</h1>
        <p class="text-base-content/70 text-sm">Gerencie seus dados e preferências de privacidade</p>
      </div>

      @if (authService.currentUser(); as user) {
        <div class="card bg-base-100 shadow-xl">
          <div class="card-body gap-4">
            <h2 class="card-title">Dados do perfil</h2>
            <div class="grid gap-2 text-sm">
              <p><span class="font-semibold">Nome:</span> {{ user.name }}</p>
              <p><span class="font-semibold">E-mail:</span> {{ user.email }}</p>
              <p>
                <span class="font-semibold">Pontos de fidelidade:</span>
                <span class="text-primary font-bold"> {{ user.loyaltyPoints }}</span>
                (até {{ loyaltyService.maxDiscount() | currency: 'BRL' }} de desconto)
              </p>
            </div>
          </div>
        </div>

        <div class="card bg-base-100 border-error/30 border shadow-xl">
          <div class="card-body gap-4">
            <h2 class="card-title text-error">Privacidade (LGPD)</h2>
            <p class="text-sm">
              Exercer o direito de eliminação dos dados (art. 18, VI da LGPD). Isso remove sessão,
              consentimento, loja selecionada, carrinho e cadastro local armazenado neste navegador.
            </p>
            <button type="button" class="btn btn-error min-h-11 w-fit" (click)="openConfirmModal()">
              Limpar dados salvos
            </button>
          </div>
        </div>
      }

      @if (showConfirmModal()) {
        <dialog class="modal modal-open" open>
          <div class="modal-box">
            <h3 class="text-lg font-bold">Confirmar exclusão</h3>
            <p class="py-4 text-sm">
              Tem certeza? Todos os dados salvos localmente serão removidos e você precisará aceitar
              o consentimento LGPD novamente.
            </p>
            <div class="modal-action">
              <button type="button" class="btn min-h-11" (click)="closeConfirmModal()">Cancelar</button>
              <button type="button" class="btn btn-error min-h-11" (click)="confirmClearData()">
                Confirmar exclusão
              </button>
            </div>
          </div>
          <form method="dialog" class="modal-backdrop">
            <button type="button" (click)="closeConfirmModal()">fechar</button>
          </form>
        </dialog>
      }
    </div>
  `
})
export class AccountPageComponent {
  protected readonly authService = inject(AuthService);
  protected readonly loyaltyService = inject(LoyaltyService);
  private readonly privacyService = inject(PrivacyService);
  private readonly router = inject(Router);

  protected readonly showConfirmModal = signal(false);

  protected readonly profile = computed(() => this.authService.currentUser());

  openConfirmModal(): void {
    this.showConfirmModal.set(true);
  }

  closeConfirmModal(): void {
    this.showConfirmModal.set(false);
  }

  confirmClearData(): void {
    this.privacyService.clearAllSavedData();
    this.showConfirmModal.set(false);
    void this.router.navigate(['/auth/login']);
  }
}
