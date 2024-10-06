import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditInvoiceComponent } from 'src/app/components/edit-invoice/edit-invoice.component';
import { InvoiceDetailComponent } from 'src/app/components/invoice-detail/invoice-detail.component';
import { InvoiceComponent } from 'src/app/components/invoice/invoice.component';
import { InvoicesComponent } from 'src/app/components/invoices/invoices.component';


const routes: Routes = [
  { path: '', component: InvoiceComponent },
  { path: 'invoices-list', component: InvoicesComponent },
  { path: ':id', component: InvoiceDetailComponent },
  { path: 'edit/invoice/:id', component: EditInvoiceComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InvoiceRoutingModule { }
