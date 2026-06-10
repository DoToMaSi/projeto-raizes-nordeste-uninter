import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';

import { Store } from '../../core/models/store.model';
import { MockApiService } from '../../core/services/mock-api.service';
import { MenuService } from '../../core/services/menu.service';
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

  protected readonly stores = signal<Store[]>([]);
  protected readonly loading = signal(true);
  protected readonly selectedId = signal<string | null>(this.storeService.selectedStore()?.id ?? null);

  async ngOnInit(): Promise<void> {
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
