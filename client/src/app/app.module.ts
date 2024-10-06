import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { AuthService } from './service/auth.service';

import { TokenInterceptor } from './interceptor/token.interceptor';
import { CustomerService } from './service/customer.service';
import { ProfileService } from './service/profile.service';
import { InvoiceService } from './service/invoice.service';
import { ClientService } from './service/client.service';
import { StoreModule, StoreRootModule } from '@ngrx/store';
import { clientReducer } from './shared/app-state/client/client.reducer';
import { EffectsModule } from '@ngrx/effects';
import { ClientEffects } from './shared/app-state/client/client.effect';
import { profileReducer } from './shared/app-state/profile/profile.reducer';
import { ProfileEffects } from './shared/app-state/profile/profile.effect';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';



@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    StoreModule.forRoot({ client: clientReducer }),
    EffectsModule.forRoot([ClientEffects]),
    StoreDevtoolsModule.instrument()
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    AuthService,
    CustomerService,
    ProfileService,
    InvoiceService,
    ClientService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
