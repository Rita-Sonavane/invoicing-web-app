import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardHomeComponent } from 'src/app/components/dashboard-home/dashboard-home.component';
import { DashboardComponent } from 'src/app/components/dashboard/dashboard.component';



const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      { path: 'dashboard-home', component: DashboardHomeComponent },
      {
        path: 'client-profile',
        loadChildren: () => import('../client/client.module').then(m => m.ClientModule)
      },
      {
        path: 'customers',
        loadChildren: () => import('../customer/customer.module').then(m => m.CustomerModule)
      },
      {
        path: 'invoice',
        loadChildren: () => import('../invoice/invoice.module').then(m => m.InvoiceModule)
      },
      { path: '', redirectTo: 'dashboard-home', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
