import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponentComponent } from 'src/app/components/admin-component/admin-component.component';
import { ClientsComponent } from 'src/app/components/clients/clients.component';
import { ClientCustomersComponent } from 'src/app/components/client-customers/client-customers.component';
import { AdminCustomerInvoicesComponent } from 'src/app/components/admin-customer-invoices/admin-customer-invoices.component';


@NgModule({
  declarations: [
    AdminComponentComponent,
    ClientsComponent,
    ClientCustomersComponent,
    AdminCustomerInvoicesComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule
  ]
})
export class AdminModule { }
