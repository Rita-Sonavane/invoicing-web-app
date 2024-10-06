import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponentComponent } from 'src/app/components/admin-component/admin-component.component';
import { AdminCustomerInvoicesComponent } from 'src/app/components/admin-customer-invoices/admin-customer-invoices.component';
import { ClientCustomersComponent } from 'src/app/components/client-customers/client-customers.component';
import { ClientsComponent } from 'src/app/components/clients/clients.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponentComponent,
    children: [
      { path: 'clients', component: ClientsComponent },
      { path: 'client-customer', component: ClientCustomersComponent },
      { path: 'admin-customer-invoice', component: AdminCustomerInvoicesComponent },
      { path: '', redirectTo: 'clients', pathMatch: 'full' },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
