import { Component, inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { CommonModule } from '@angular/common';
import { CountryService } from '../services/country.service';
import { NgxStripeModule, StripeCardComponent, StripeService } from 'ngx-stripe';
import { StripeCardElementOptions, StripeElementsOptions } from '@stripe/stripe-js';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,FormsModule,NgxStripeModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent {
  users: any[] = [];
  countries: any[] = [];
  savedcards: any[] = [];
  userForm: FormGroup;
  isModalOpen = false;
  isEditing = false;
  isCardModalOpen = false;
  currentUserId!: string;
  cardtoken!: string;
  customer_id!: string;
  searchquery: string = "";
  sorting: string = "";
  totalpage!: number;
  currentpage: number = 1;
  userservice: UserService = inject(UserService);
  countryservice: CountryService = inject(CountryService);
  stripeservice: StripeService = inject(StripeService);
  @ViewChild(StripeCardComponent) card!: StripeCardComponent;
  imagefile: any
  private toastr = inject(ToastrService);

  
    
    cardOptions: StripeCardElementOptions = {
      style: {
        base: {
          iconColor: '#666EE8',
          color: '#31325F',
          fontWeight: '300',
          fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
          fontSize: '18px',
          '::placeholder': {
            color: '#CFD7E0'
          }
        }
      }
    };
    
    elementsOptions: StripeElementsOptions = {
      locale: 'en'
    };
    constructor(
      private fb: FormBuilder,
    ) {
      this.userForm = this.fb.group({
        profile: ['', Validators.required],
        name: ['', Validators.required,],
        email: ['', [Validators.required, Validators.email ,this.emailduplicateValidator]],
        country: ['', [Validators.required]],
        phone: ['', [Validators.required ,this.phoneduplicateValidator, Validators.pattern(/^[0-9]{10}$/)]]
      });
    }


    emailduplicateValidator = (control: { value: any; }) => {
      const email = control.value;
      const isDuplicate = this.users.some(user => user.email === email);
      return isDuplicate ? { 'duplicate': true } : null;
    }
  
    phoneduplicateValidator = (control: { value: any; }) => {
      const phone = control.value;
      const isDuplicate = this.users.some(user => user.phone === phone);
      return isDuplicate ? { 'duplicate': true } : null;
    }
  
    ngOnInit() {
      this.getusers();
      this.getallcountry();
      console.log(this.userForm);
    }

  
    getusers() {
      this.userservice.getusers(this.currentpage,this.searchquery,this.sorting).subscribe({next: (data:any) => {
        this.users = data.results
        const length = data.datalength.length;
        this.totalpage = Math.ceil(length / 3);
        this.toastr.success('User fetched successfully', 'Success');
      },
      error: () => {
        this.toastr.error('Failed to fetch User', 'Error');
      }});
    }

    changepage(page: number) {
      this.currentpage = page;
      this.getusers();
    }
  
    openModal() {
      this.isModalOpen = true;
      this.isEditing = false;
      this.userForm.reset();
    }
  
    closeModal() {
      this.isModalOpen = false;
      this.userForm.reset();
      this.imagefile = ""
    }
  
    editUser(user: any) {
      console.log(user);
      this.isModalOpen = true;
      this.isEditing = true;
      this.userForm.patchValue({
        name: user.name,
        email: user.email,
        phone: user.phone,
        country: user.country
      });
      this.currentUserId = user._id;
    }

    deleteUser(userid:string){
      this.userservice.deleteuser(userid).subscribe({next: ()=> {
        this.toastr.success('User deleted successfully', 'Success');
      },
      error: () => {
        this.toastr.error('Failed to delete User', 'Error'); 
      }})
      this.getusers();
    }
  
    onSubmit() {
        const formData = new FormData
        formData.append('profile', this.imagefile)
        formData.append('name', this.userForm.get('name')?.value)
        formData.append('email', this.userForm.get('email')?.value)
        formData.append('country', this.userForm.get('country')?.value)
        formData.append('phone', this.userForm.get('phone')?.value)
        
        if (this.isEditing && this.currentUserId) {
          const userid = this.currentUserId;
          this.userservice.updateuser(formData,userid).subscribe({next:() => {
            this.getusers();
            this.closeModal();
            this.toastr.success('User updated successfully', 'Success');
          },
          error: () => {
            this.toastr.error('Failed to update User', 'Error');
          }});
        } else {
          this.userservice.adduser(formData).subscribe({next:() => {
            this.getusers();
            this.closeModal();
            this.toastr.success('User added successfully', 'Success');
          },
          error: () => {
            this.toastr.error('Failed to add User', 'Error');
          }});
        }

       
    }

    uploadimage(event:Event){
      this.imagefile = (event.target as HTMLInputElement)?.files?.[0];
    }

    getallcountry(){
      this.countryservice.getallcountries().subscribe({next: (data:any) => {
        this.countries = data
        console.log(this.countries)
      }});
    }

    openCardModal(data:string) {
      this.isCardModalOpen = true;
      this.customer_id = data;
      this.userservice.getcustomercard(data).subscribe({next: (data:any) => {
        this.savedcards = data.paymentMethods.data
        console.log(this.savedcards)
      }});
    }
    
    closeCardModal() {
      this.isCardModalOpen = false;
    }
    
    createToken(): void {
      this.stripeservice
        .createToken(this.card.element, { name: 'User Card' })
        .subscribe((result) => {
          if (result.token) {
            console.log('Token Created:', result.token.id);
            this.cardtoken = result.token.id;
            this.addcard();
            this.closeCardModal();
          }
          });
    }
    
    addcard(){
     const data = {
      token : this.cardtoken,
      customer_id : this.customer_id
      }
      this.userservice.addcard(data).subscribe({next: () => {
        this.toastr.success('Card added successfully', 'Success');        
      },
      error: () => {
        this.toastr.error('Failed to add card', 'Error');
      }});
    }

    setdefaultcard(cardId: string) {
      console.log(cardId)
      const paylod = {
        customer_id : this.customer_id,
        paymentmethodid : cardId
      }
      this.userservice.savedefault(paylod).subscribe({next: () => {
        this.toastr.success('Default card updated', 'Success');
      }});
      this.userservice.getcustomercard(this.customer_id).subscribe({next: (data:any) => {
        this.savedcards = data.paymentMethods.data;
      }});

    }
    onclicksorting(field:string){
      this.sorting = field;
      this.getusers();
    }

    
  }