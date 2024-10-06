import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from 'src/app/components/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { clientReducer } from 'src/app/shared/app-state/client/client.reducer';
import { ClientEffects } from 'src/app/shared/app-state/client/client.effect';




@NgModule({
  declarations: [
    LoginComponent,
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    StoreModule.forFeature('client', clientReducer),
    EffectsModule.forFeature([ClientEffects]),
  ]
})
export class AuthModule { }
