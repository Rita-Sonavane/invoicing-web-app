import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InvoiceRoutingModule } from './invoice-routing.module';
import { InvoiceComponent } from 'src/app/components/invoice/invoice.component';
import { InvoiceDetailComponent } from 'src/app/components/invoice-detail/invoice-detail.component';
import { InvoicesComponent } from 'src/app/components/invoices/invoices.component';
import { EditInvoiceComponent } from 'src/app/components/edit-invoice/edit-invoice.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    InvoiceComponent,
    InvoiceDetailComponent,
    InvoicesComponent,
    EditInvoiceComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    InvoiceRoutingModule
  ]
})
export class InvoiceModule { }
