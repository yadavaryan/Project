import { ApplicationConfig, importProvidersFrom, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // Ensure this is correctly imported
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr'; // Ensure this is imported properly

import { routes } from './app.routes';
import { NgxStripeModule } from 'ngx-stripe';
import { AuthInterceptor } from './services/auth.interceptor';
import { provideServiceWorker } from '@angular/service-worker';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    importProvidersFrom(HttpClientModule, NgxStripeModule.forRoot('pk_test_51QhUo74FHz8fCvAZPTJbYiuDgpJPbzMPtxiwpg1oRbOsL7uVdXI0Yng5eTiykYCQ7yloL63AD3a8OYZwE40YzG4100FO6Saaea'), BrowserAnimationsModule, ToastrModule.forRoot({
        positionClass: 'toast-top-right',
        timeOut: 4000,
        progressBar: true,
        closeButton: true,
    })),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    provideServiceWorker('ngsw-worker.js', {
        enabled: !isDevMode(),
        registrationStrategy: 'registerWhenStable:30000'
    })
],
};
