import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginService } from '../services/login.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule,FormsModule,CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  
  loginForm: FormGroup;
  isLoading = false;
  token! : any
  errormessage! : string
  loginservice: LoginService = inject(LoginService);
  router = inject(Router);
  private toastr = inject(ToastrService);


  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;

      console.log('Login form submitted:', this.loginForm.value);
      this.loginservice.login(this.loginForm.value).subscribe({next: (data:any)=> {
        this.token = data
        localStorage.setItem("token",data);
        this.toastr.success(' Login successfully', 'Success');
        this.router.navigate(['/rides']);
        
      },
      error: (errorResponse) => {
        this.errormessage = (errorResponse.error?.error?.message);
        this.toastr.error(this.errormessage, 'error');
      },
    })


      setTimeout(() => {
        this.isLoading = false;
        this.loginForm.reset()
      }, 1500);

    } else {
      Object.keys(this.loginForm.controls).forEach(key => {
        const control = this.loginForm.get(key);
        if (control) {
          control.markAsTouched();
        }
      });
    }
  }

}
