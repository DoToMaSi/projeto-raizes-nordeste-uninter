import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject, input, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { MenuProduct, ProductOption } from '../../core/models/product.model';

@Component({
  selector: 'app-product-customize',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, CurrencyPipe],
  template: `
    @if (product(); as item) {
      <dialog class="modal modal-open" open>
        <div class="modal-box max-w-lg">
          <h3 class="text-lg font-bold">{{ item.name }}</h3>
          <p class="text-base-content/70 py-2 text-sm">{{ item.description }}</p>
          <p class="text-primary font-semibold">A partir de {{ item.price | currency: 'BRL' }}</p>

          <form class="mt-4 flex flex-col gap-4" [formGroup]="form" (ngSubmit)="confirm()">
            <fieldset>
              <legend class="mb-2 font-semibold">Tamanho</legend>
              <div class="flex flex-col gap-2">
                @for (size of item.sizes; track size.id) {
                  <label class="label cursor-pointer justify-start gap-3">
                    <input
                      type="radio"
                      class="radio radio-primary min-h-11 min-w-11"
                      formControlName="sizeId"
                      [value]="size.id"
                    />
                    <span class="label-text">
                      {{ size.name }}
                      @if (size.price > 0) {
                        (+{{ size.price | currency: 'BRL' }})
                      }
                    </span>
                  </label>
                }
              </div>
            </fieldset>

            @if (item.addons.length > 0) {
              <fieldset>
                <legend class="mb-2 font-semibold">Adicionais</legend>
                <div class="flex flex-col gap-2">
                  @for (addon of item.addons; track addon.id) {
                    <label class="label cursor-pointer justify-start gap-3">
                      <input
                        type="checkbox"
                        class="checkbox checkbox-primary min-h-11 min-w-11"
                        [checked]="isAddonSelected(addon.id)"
                        (change)="toggleAddon(addon.id, $event)"
                      />
                      <span class="label-text">{{ addon.name }} (+{{ addon.price | currency: 'BRL' }})</span>
                    </label>
                  }
                </div>
              </fieldset>
            }

            <label class="form-control w-full max-w-xs">
              <span class="label-text mb-1">Quantidade</span>
              <input
                type="number"
                min="1"
                class="input input-bordered min-h-11"
                formControlName="quantity"
              />
            </label>

            <div class="modal-action">
              <button type="button" class="btn min-h-11" (click)="cancelled.emit()">Cancelar</button>
              <button type="submit" class="btn btn-primary min-h-11" [disabled]="form.invalid">
                Adicionar ao carrinho
              </button>
            </div>
          </form>
        </div>
        <form method="dialog" class="modal-backdrop">
          <button type="button" (click)="cancelled.emit()">fechar</button>
        </form>
      </dialog>
    }
  `
})
export class ProductCustomizeComponent {
  readonly product = input<MenuProduct | null>(null);
  readonly confirmed = output<{
    size: ProductOption;
    addons: ProductOption[];
    quantity: number;
  }>();
  readonly cancelled = output<void>();

  private readonly fb = inject(FormBuilder);

  protected readonly selectedAddons = signal<string[]>([]);

  protected readonly form = this.fb.nonNullable.group({
    sizeId: ['', Validators.required],
    quantity: [1, [Validators.required, Validators.min(1)]]
  });

  constructor() {
    effect(() => {
      const item = this.product();
      if (item && item.sizes.length > 0) {
        this.form.patchValue({ sizeId: item.sizes[0].id, quantity: 1 });
        this.selectedAddons.set([]);
      }
    });
  }

  isAddonSelected(addonId: string): boolean {
    return this.selectedAddons().includes(addonId);
  }

  toggleAddon(addonId: string, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.selectedAddons.update((ids) =>
      checked ? [...ids, addonId] : ids.filter((id) => id !== addonId)
    );
  }

  confirm(): void {
    const item = this.product();
    if (!item || this.form.invalid) {
      return;
    }

    const { sizeId, quantity } = this.form.getRawValue();
    const size = item.sizes.find((entry) => entry.id === sizeId);
    if (!size) {
      return;
    }

    const addons = item.addons.filter((addon) => this.selectedAddons().includes(addon.id));
    this.confirmed.emit({ size, addons, quantity });
  }
}
