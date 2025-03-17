import { Component, inject } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { routes } from '../app.routes';
import { LoginService } from '../services/login.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  router = inject(Router);
  authservice:LoginService = inject(LoginService)
  private toastr = inject(ToastrService);

  
  logout(){
    this.router.navigate(['/auth']);
    this.authservice.logout()
    this.toastr.success('Logout successfully', 'Success');
  }
}
