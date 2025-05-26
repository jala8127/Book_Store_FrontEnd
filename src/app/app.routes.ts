import { Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';

// Admin Imports
import { AdminDashboardComponent } from './Admin/admin-dashboard/admin-dashboard.component';
import { AdminHomeComponent } from './Admin/admin-home/admin-home.component';
import { AdminOrdersComponent } from './Admin/admin-orders/admin-orders.component';
import { AllOrdersComponent } from './Admin/admin-orders/all-orders/all-orders.component';
import { PendingComponent } from './Admin/admin-orders/pending/pending.component';
import { CompletedComponent } from './Admin/admin-orders/completed/completed.component';
import { AdminLibraryComponent } from './Admin/admin-library/admin-library.component';

// User Imports
import { DashboardComponent } from './User/dashboard/dashboard.component';
import { UserHomeComponent } from './User/user-home/user-home.component';
import { LibraryComponent } from './User/library/library.component';
import { OrdersComponent } from './User/orders/orders.component';
import { UserCartComponent } from './User/user-cart/user-cart.component';

export const routes: Routes = [
  // Default route
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  // Login Page
  { path: 'home', component: HomeComponent },

  // Admin Routes
  {
    path: 'admin-dashboard',
    component: AdminDashboardComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: AdminHomeComponent },
      { path: 'library', component: AdminLibraryComponent },
      {
          path: 'orders',
          component: AdminOrdersComponent,
          children: [
               { path: '', redirectTo: 'all', pathMatch: 'full' }, 
               { path: 'all', component: AllOrdersComponent },
               { path: 'pending', component: PendingComponent },
               { path: 'completed', component: CompletedComponent }
        ]
      }
    ]
  },

  // User Routes
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: UserHomeComponent },
      { path: 'library', component: LibraryComponent },
      { path: 'orders', component: OrdersComponent },
      { path: 'cart', component: UserCartComponent }
    ]
  }
];