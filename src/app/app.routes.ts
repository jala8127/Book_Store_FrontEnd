import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AdminDashboardComponent } from './AdminComponent/admin-dashboard/admin-dashboard.component';
import { DashboardComponent } from './UserComponent/dashboard/dashboard.component';
import { AdminOrdersComponent } from './AdminComponent/admin-orders/admin-orders.component';
import { AdminHomeComponent } from './AdminComponent/admin-home/admin-home.component';

import { AllOrdersComponent } from './AdminComponent/admin-orders/all-orders/all-orders.component';
import { PendingComponent } from './AdminComponent/admin-orders/pending/pending.component';
import { CompletedComponent } from './AdminComponent/admin-orders/completed/completed.component';
import { AdminLibraryComponent } from './AdminComponent/admin-library/admin-library.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'dashboard', component: DashboardComponent },

  {
    path: 'admin-dashboard',
    component: AdminDashboardComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },  // 👈 Redirect /admin-dashboard to /admin-dashboard/home
      { path: 'home', component: AdminHomeComponent },
      { path: 'library', component: AdminLibraryComponent },
      {
        path: 'orders',
        component: AdminOrdersComponent,
        children: [
          { path: 'all', component: AllOrdersComponent },
          { path: 'pending', component: PendingComponent },
          { path: 'completed', component: CompletedComponent }
        ]
      }
    ]
  }
];