import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientRoutingModule } from './client-routing.module';
import { ClientProfileComponent } from 'src/app/components/client-profile/client-profile.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ClientProfileComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ClientRoutingModule
  ]
})
export class ClientModule { }
