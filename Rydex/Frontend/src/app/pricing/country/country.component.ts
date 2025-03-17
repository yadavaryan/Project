import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import Modal from 'bootstrap/js/dist/modal';
import modal from 'bootstrap/js/dist/modal';
import { CountryService } from '../../services/country.service';
import { CountrysearchPipe } from '../../pipes/countrysearch.pipe';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-country',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,HttpClientModule,CountrysearchPipe,FormsModule],
  templateUrl: './country.component.html',
  styleUrl: './country.component.css'
})
export class CountryComponent {
  countryForm: FormGroup;
  private modal: Modal | null = null;
  countryservice : CountryService = inject(CountryService);
  countrydetails: any[] =[];
  countryname! : string;
  flags!: string
  timezone!: string
  countries: any[] = [];
  searchquery: any;
  private toastr = inject(ToastrService);


  constructor(private fb: FormBuilder) {
    this.countryForm = this.fb.group({
      name: ['', [Validators.required]],
      currency: ['', [Validators.required, Validators.pattern('^[A-Z]{3}$')]],
      countryCode: ['', [Validators.required, Validators.pattern('^[A-Z]{2}$')]],
      callingCode: ['', [Validators.required, Validators.pattern('^[0-9]{1,4}$')]]
    });
  }

  ngOnInit() {
    const modalElement = document.getElementById('countryModal');
    if (modalElement) {
      this.modal = new Modal(modalElement);
    }
    this.getallcountry();
  }

  openModal() {
    this.countryForm.reset();
    this.modal?.show();
  }

  closeModal() {
    this.modal?.hide();
  }

 

  fetchCountry(){
    let countryinput : any  = document.getElementById('countryName')
    this.countryservice.fetchcountry(countryinput.value).subscribe({next: (data:any) => {
      this.countrydetails = data
      this.countryname = this.countrydetails[0].name.common
      const basecurrency = Object.keys(this.countrydetails[0].currencies)[0];
      const symbol = this.countrydetails[0].currencies[basecurrency].symbol;
      const currency = basecurrency +" "+"("+ symbol+ ")"
      const root = this.countrydetails[0].idd.root;
      const suffix = this.countrydetails[0].idd.suffixes[0]
      const countrycode = this.countrydetails[0].fifa
      const countrycallingcode = root + suffix;
      console.log(this.countrydetails);
      this.flags = this.countrydetails[0].flags.png
      this.timezone = this.countrydetails[0].timezones[0]
      console.log(this.timezone)

      this.countryForm.patchValue({
        currency: currency,
        countryCode: countrycode,
        callingCode: countrycallingcode.replace('+','') 
      });
      this.toastr.success('Countries fetched successfully', 'Success');

    },
    error: () => {
      this.toastr.error('Failed to fetch Countries', 'Error'); 
    }});
  }

  OnAddcountry(){
    const countrydata = {
      countryname: this.countryname,
      currency: this.countryForm.get('currency')?.value,
      countryCode: this.countryForm.get('countryCode')?.value,
      callingCode: this.countryForm.get('callingCode')?.value,
      flag: this.flags,
      timezone: this.timezone,
    };
  
    this.createcountrys(countrydata);
    this.countryForm.reset();
    this.closeModal();
    this.flags = '';
    
  }

  createcountrys(data:any){
    this.countryservice.createcountry(data).subscribe({next: ()=> {
      console.log('country created')
      this.toastr.success('Countries added successfully', 'Success');
      this.getallcountry();
    }});
  }

  getallcountry(){
    this.countryservice.getallcountries().subscribe({next: (data:any) => {
      this.countries = data
      console.log(this.countries)
    }});
  }

}

  