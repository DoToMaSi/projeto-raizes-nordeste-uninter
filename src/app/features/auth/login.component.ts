import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="card bg-base-100 mx-auto w-full max-w-md shadow-xl">
      <div class="card-body">
        <h1 class="card-title text-2xl">Entrar</h1>
        <p class="text-base-content/70 text-sm">Acesse sua conta Raízes do Nordeste</p>

        <form class="flex flex-col gap-4" [formGroup]="form" (ngSubmit)="onSubmit()">
          <label class="form-control w-full">
            <span class="label-text mb-1">E-mail</span>
            <input
              type="email"
              class="input input-bordered w-full min-h-11"
              formControlName="email"
              autocomplete="email"
            />
          </label>

          <label class="form-control w-full">
            <span class="label-text mb-1">Senha</span>
            <input
              type="password"
              class="input input-bordered w-full min-h-11"
              formControlName="password"
              autocomplete="current-password"
            />
          </label>

          @if (errorMessage()) {
            <p class="text-error text-sm">{{ errorMessage() }}</p>
          }

          <button type="submit" class="btn btn-primary min-h-11" [disabled]="form.invalid || loading()">
            @if (loading()) {
              <span class="loading loading-spinner loading-sm"></span>
            }
            Entrar
          </button>
        </form>

        <p class="text-center text-sm">
          Não tem conta?
          <a routerLink="/auth/register" class="link link-primary">Cadastre-se</a>
        </p>

        <div class="bg-base-200 rounded-box p-3 text-xs">
          <p class="font-semibold">Conta demo:</p>
          <p>maria@email.com / 123456</p>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  protected readonly loading = signal(false);
  protected readonly errorMessage = signal<string | null>(null);

  async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);

    const { email, password } = this.form.getRawValue();
    const success = await this.authService.login(email, password);

    this.loading.set(false);

    if (success) {
      await this.router.navigate(['/loja']);
      return;
    }

    this.errorMessage.set('E-mail ou senha inválidos.');
  }
}
