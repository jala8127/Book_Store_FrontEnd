import { Routes } from '@angular/router';
import { HomeComponent } from '../home/home.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminHomeComponent } from './admin-dashboard/admin-home/admin-home.component';
import { AdminLibraryComponent } from './admin-dashboard/admin-library/admin-library.component';
import { AdminOrdersComponent } from './admin-dashboard/admin-orders/admin-orders.component';
import { AllOrdersComponent } from './admin-dashboard/admin-orders/all-orders/all-orders.component';
import { CompletedComponent } from './admin-dashboard/admin-orders/completed/completed.component';
import { PendingComponent } from './admin-dashboard/admin-orders/pending/pending.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'dashboard', component: DashboardComponent },

  {
    path: 'admin-dashboard',
    component: AdminDashboardComponent,
    children: [
      { path: 'home', component: AdminHomeComponent},
      { path: 'library', component: AdminLibraryComponent },
      { path: 'orders', component: AdminOrdersComponent ,
        children: [
          { path: 'all', component: AllOrdersComponent},
          { path: 'pending', component: PendingComponent},
          { path: 'completed', component: CompletedComponent}
        ]
      },
    ]
  }
]