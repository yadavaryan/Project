import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { DriverComponent } from './driver/driver.component';
import { PricingComponent } from './pricing/pricing.component';
import { RidesComponent } from './rides/rides.component';
import { SettingComponent } from './setting/setting.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgxStripeModule } from 'ngx-stripe';
import { LoginService } from './services/login.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,NavbarComponent,HttpClientModule,FormsModule,CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  constructor(private http:HttpClient) {}
  title = 'Task3';
  islogin = false;
  private idletimeout: any;
  private timeoutDuration: number = 20 * 60 * 1000;
  router = inject(Router)
  authservice : LoginService = inject(LoginService)

  ngOnInit(): void {
    this.checkidle()
    this.authservice.islogin.subscribe({next:(data:any) => {
      this.islogin = data;
  }});
  }

  checkidle(): void {
    const resettimer = () => {
      clearTimeout(this.idletimeout);
      this.idletimeout = setTimeout(() => {
        this.authservice.logout()
        this.router.navigate(['/auth'])
      }, this.timeoutDuration);
      

    };


    window.addEventListener('mousemove', resettimer);

    resettimer()

  }

  subscribeToNotifications(): void {
    navigator.serviceWorker.ready.then((registration) => {
      registration.pushManager
        .subscribe({
          userVisibleOnly: true,
          applicationServerKey: this.urlBase64ToUint8Array('BIaGOdir59RS1gskDxgPY5AstT7ygIHll3KjoQtW9la5rJyKOEbZ7Y5iod9cl65d_QY4V6DntLmpGdwyjn8JwQE'),
        })
        .then((subscription) => {
          console.log('Push subscription:', subscription);
        })
        .catch((error) => console.error('Subscription failed:', error));
    });
  }
  
  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    return new Uint8Array([...rawData].map((char) => char.charCodeAt(0)));
  }
  
}
