import { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth.guard';
import { homeRedirectGuard } from './core/guards/home-redirect.guard';
import { lgpdGuard } from './core/guards/lgpd.guard';
import { storeGuard } from './core/guards/store.guard';
import { AppShellComponent } from './shared/components/app-shell.component';

export const routes: Routes = [
  {
    path: 'pagamento/:orderId/aguardando',
    loadComponent: () =>
      import('./features/payment/payment-waiting.component').then((m) => m.PaymentWaitingComponent),
    canActivate: [lgpdGuard, authGuard]
  },
  {
    path: 'pagamento/:orderId/gateway',
    loadComponent: () =>
      import('./features/payment/payment-gateway.component').then((m) => m.PaymentGatewayComponent),
    canActivate: [lgpdGuard, authGuard]
  },
  {
    path: 'pagamento/:orderId/callback',
    loadComponent: () =>
      import('./features/payment/payment-callback.component').then((m) => m.PaymentCallbackComponent),
    canActivate: [lgpdGuard, authGuard]
  },
  {
    path: '',
    component: AppShellComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        canActivate: [homeRedirectGuard],
        children: []
      },
      {
        path: 'auth/login',
        loadComponent: () => import('./features/auth/login.component').then((m) => m.LoginComponent)
      },
      {
        path: 'auth/register',
        loadComponent: () =>
          import('./features/auth/register.component').then((m) => m.RegisterComponent)
      },
      {
        path: 'loja',
        loadComponent: () =>
          import('./features/store/store-select.component').then((m) => m.StoreSelectComponent),
        canActivate: [lgpdGuard, authGuard]
      },
      {
        path: 'cardapio',
        loadComponent: () =>
          import('./features/menu/menu-browse.component').then((m) => m.MenuBrowseComponent),
        canActivate: [lgpdGuard, authGuard, storeGuard]
      },
      {
        path: 'carrinho',
        loadComponent: () =>
          import('./features/cart/cart-page.component').then((m) => m.CartPageComponent),
        canActivate: [lgpdGuard, authGuard, storeGuard]
      },
      {
        path: 'checkout',
        loadComponent: () =>
          import('./features/cart/checkout.component').then((m) => m.CheckoutComponent),
        canActivate: [lgpdGuard, authGuard, storeGuard]
      },
      {
        path: 'pedido/:orderId',
        loadComponent: () =>
          import('./features/order/order-tracking.component').then((m) => m.OrderTrackingComponent),
        canActivate: [lgpdGuard, authGuard]
      }
    ]
  },
  { path: '**', redirectTo: 'auth/login' }
];
