import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="card bg-base-100 mx-auto w-full max-w-md shadow-xl">
      <div class="card-body">
        <h1 class="card-title text-2xl">Cadastro</h1>
        <p class="text-base-content/70 text-sm">Crie sua conta para fazer pedidos</p>

        <form class="flex flex-col gap-4" [formGroup]="form" (ngSubmit)="onSubmit()">
          <label class="form-control w-full">
            <span class="label-text mb-1">Nome completo</span>
            <input
              type="text"
              class="input input-bordered w-full min-h-11"
              formControlName="name"
              autocomplete="name"
            />
          </label>

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
              autocomplete="new-password"
            />
          </label>

          <label class="label cursor-pointer justify-start gap-3">
            <input
              type="checkbox"
              class="checkbox checkbox-primary min-h-11 min-w-11"
              formControlName="dataProcessing"
            />
            <span class="label-text">
              Autorizo o tratamento dos meus dados pessoais
              <span class="text-error">*</span>
            </span>
          </label>

          <label class="label cursor-pointer justify-start gap-3">
            <input
              type="checkbox"
              class="checkbox checkbox-primary min-h-11 min-w-11"
              formControlName="marketing"
            />
            <span class="label-text">Desejo receber ofertas por e-mail (opcional)</span>
          </label>

          @if (errorMessage()) {
            <p class="text-error text-sm">{{ errorMessage() }}</p>
          }

          <button type="submit" class="btn btn-primary min-h-11" [disabled]="form.invalid || loading()">
            @if (loading()) {
              <span class="loading loading-spinner loading-sm"></span>
            }
            Cadastrar
          </button>
        </form>

        <p class="text-center text-sm">
          Já tem conta?
          <a routerLink="/auth/login" class="link link-primary">Entrar</a>
        </p>
      </div>
    </div>
  `
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    dataProcessing: [false, Validators.requiredTrue],
    marketing: [false]
  });

  protected readonly loading = signal(false);
  protected readonly errorMessage = signal<string | null>(null);

  async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);

    const { name, email, password } = this.form.getRawValue();
    const success = await this.authService.register(name, email, password);

    this.loading.set(false);

    if (success) {
      await this.router.navigate(['/loja']);
      return;
    }

    this.errorMessage.set('Este e-mail já está cadastrado.');
  }
}
