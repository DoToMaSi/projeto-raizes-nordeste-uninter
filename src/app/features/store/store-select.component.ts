import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';

import { Store } from '../../core/models/store.model';
import { MockApiService } from '../../core/services/mock-api.service';
import { MenuService } from '../../core/services/menu.service';
import { PromotionsService } from '../../core/services/promotions.service';
import { StoreService } from '../../core/services/store.service';

@Component({
  selector: 'app-store-select',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  template: `
    <div class="flex flex-col gap-6">
      <div>
        <h1 class="text-2xl font-bold">Escolha sua loja</h1>
        <p class="text-base-content/70">Selecione a unidade mais próxima para ver o cardápio local</p>
      </div>

      @if (promotionsService.loading()) {
        <div class="flex justify-center py-4">
          <span class="loading loading-spinner loading-md text-primary"></span>
        </div>
      } @else if (visiblePromotions().length > 0) {
        <section class="flex flex-col gap-3">
          <h2 class="text-lg font-semibold">Promoções em destaque</h2>
          <div class="grid grid-cols-1 gap-3 md:grid-cols-2">
            @for (promo of visiblePromotions(); track promo.id) {
              <div class="card bg-base-100 border-primary/20 border shadow-md">
                <div class="card-body gap-2 p-4">
                  <div class="flex items-start justify-between gap-2">
                    <h3 class="font-semibold">{{ promo.title }}</h3>
                    <span class="badge badge-primary badge-sm">{{ promo.badge }}</span>
                  </div>
                  <p class="text-base-content/70 text-sm">{{ promo.description }}</p>
                </div>
              </div>
            }
          </div>
        </section>
      }

      @if (loading()) {
        <div class="flex justify-center py-12">
          <span class="loading loading-spinner loading-lg text-primary"></span>
        </div>
      } @else {
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          @for (store of stores(); track store.id) {
            <button
              type="button"
              class="card bg-base-100 cursor-pointer text-left shadow-xl transition hover:shadow-2xl"
              [class.ring-2]="selectedId() === store.id"
              [class.ring-primary]="selectedId() === store.id"
              (click)="selectStore(store)"
            >
              <div class="card-body">
                <h2 class="card-title">{{ store.name }}</h2>
                <p class="text-sm">{{ store.city }}</p>
                <p class="text-base-content/60 text-sm">{{ store.address }}</p>
                @if (selectedId() === store.id) {
                  <div class="badge badge-primary">Selecionada</div>
                }
              </div>
            </button>
          }
        </div>

        @if (selectedId()) {
          <button type="button" class="btn btn-primary min-h-11 w-full md:w-auto" (click)="goToMenu()">
            Ver cardápio
          </button>
        }
      }
    </div>
  `
})
export class StoreSelectComponent implements OnInit {
  private readonly mockApi = inject(MockApiService);
  private readonly storeService = inject(StoreService);
  private readonly menuService = inject(MenuService);
  private readonly router = inject(Router);
  protected readonly promotionsService = inject(PromotionsService);

  protected readonly stores = signal<Store[]>([]);
  protected readonly loading = signal(true);
  protected readonly selectedId = signal<string | null>(this.storeService.selectedStore()?.id ?? null);

  protected readonly visiblePromotions = computed(() =>
    this.promotionsService.getPromotionsForStore(this.selectedId())
  );

  async ngOnInit(): Promise<void> {
    await this.promotionsService.loadPromotions();
    const stores = await this.mockApi.getStores();
    this.stores.set(stores);
    this.loading.set(false);
  }

  selectStore(store: Store): void {
    this.storeService.selectStore(store);
    this.selectedId.set(store.id);
  }

  async goToMenu(): Promise<void> {
    await this.menuService.loadMenuForSelectedStore();
    await this.router.navigate(['/cardapio']);
  }
}
