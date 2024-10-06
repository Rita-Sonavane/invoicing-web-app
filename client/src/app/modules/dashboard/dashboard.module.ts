import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardHomeComponent } from 'src/app/components/dashboard-home/dashboard-home.component';
import { DashboardComponent } from 'src/app/components/dashboard/dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { profileReducer } from 'src/app/shared/app-state/profile/profile.reducer';
import { ProfileEffects } from 'src/app/shared/app-state/profile/profile.effect';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';



@NgModule({
  declarations: [
    DashboardComponent,
    DashboardHomeComponent,
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    StoreModule.forFeature('profile', profileReducer),
    EffectsModule.forFeature([ProfileEffects]),
  ]
})
export class DashboardModule { }
