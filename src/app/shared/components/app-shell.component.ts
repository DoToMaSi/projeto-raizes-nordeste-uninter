import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="bg-base-200 flex min-h-screen flex-col">
      <div class="navbar bg-primary text-primary-content sticky top-0 z-40 shadow-md">
        <div class="flex-1">
          <a routerLink="/" class="btn btn-ghost text-xl min-h-11">Raízes do Nordeste</a>
        </div>

        <div class="hidden flex-none gap-1 md:flex">
          @if (authService.isAuthenticated()) {
            <a routerLink="/loja" routerLinkActive="btn-active" class="btn btn-ghost min-h-11">Loja</a>
            <a routerLink="/cardapio" routerLinkActive="btn-active" class="btn btn-ghost min-h-11">
              Cardápio
            </a>
            <a routerLink="/carrinho" routerLinkActive="btn-active" class="btn btn-ghost min-h-11">
              Carrinho
              @if (cartService.itemCount() > 0) {
                <span class="badge badge-secondary badge-sm">{{ cartService.itemCount() }}</span>
              }
            </a>
            <button type="button" class="btn btn-ghost min-h-11" (click)="logout()">Sair</button>
          } @else {
            <a routerLink="/auth/login" routerLinkActive="btn-active" class="btn btn-ghost min-h-11">
              Entrar
            </a>
          }
        </div>
      </div>

      <main class="container mx-auto flex-1 px-4 py-6 pb-24 md:pb-6">
        <router-outlet />
      </main>

      @if (authService.isAuthenticated()) {
        <nav class="btm-nav bg-base-100 border-base-300 border-t md:hidden">
          <a routerLink="/loja" routerLinkActive="active" class="min-h-11">
            <span class="btm-nav-label text-xs">Loja</span>
          </a>
          <a routerLink="/cardapio" routerLinkActive="active" class="min-h-11">
            <span class="btm-nav-label text-xs">Cardápio</span>
          </a>
          <a routerLink="/carrinho" routerLinkActive="active" class="min-h-11">
            <span class="btm-nav-label text-xs">Carrinho</span>
            @if (cartService.itemCount() > 0) {
              <span class="badge badge-primary badge-xs absolute right-4 top-1">{{
                cartService.itemCount()
              }}</span>
            }
          </a>
        </nav>
      }
    </div>
  `
})
export class AppShellComponent {
  protected readonly authService = inject(AuthService);
  protected readonly cartService = inject(CartService);
  private readonly router = inject(Router);

  logout(): void {
    this.authService.logout();
    this.cartService.clear();
    void this.router.navigate(['/auth/login']);
  }
}
