import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerFormComponent } from 'src/app/components/customer-form/customer-form.component';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    CustomerFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  exports: [CustomerFormComponent]
})
export class SharedModule { }
