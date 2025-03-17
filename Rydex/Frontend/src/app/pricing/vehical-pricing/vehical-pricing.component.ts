import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CountryService } from '../../services/country.service';
import { CityService } from '../../services/city.service';
import { VehicletypeService } from '../../services/vehicletype.service';
import { VehiclepricingService } from '../../services/vehiclepricing.service';
import Modal from 'bootstrap/js/dist/modal';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-vehical-pricing',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './vehical-pricing.component.html',
  styleUrl: './vehical-pricing.component.css'
})
export class VehicalPricingComponent {
  pricingForm: FormGroup;
  private modal: Modal | null = null;
  countryservice : CountryService = inject(CountryService);
  cityservice : CityService = inject(CityService);
  vehicleservice: VehicletypeService= inject(VehicletypeService);
  vehiclepricing: VehiclepricingService= inject(VehiclepricingService);
  countries: any[] = [];
  savedPricingData: any[] = [];
  allcity: any[] = [];
  cityarray: any[] = [];
  allvehicle: any[] = [];
  specificpricing: any[] = [];
  pricingdata: any
  selectedCountry: string = ''
  selectedCity: string = ''
  selectedTypeid: string = ''
  vehicletype: string = ''
  editing: boolean = false;
  private toastr = inject(ToastrService);

  
  

  constructor(private fb: FormBuilder) {
    this.pricingForm = this.fb.group({
      country: ['', Validators.required],
      city: ['', Validators.required],
      type: ['', Validators.required],
      driverProfit: ['', [Validators.required, Validators.min(0)]],
      minFare: ['', [Validators.required, Validators.min(0)]],
      baseDistance: ['', [Validators.required, Validators.min(0)]],
      basePrice: ['', [Validators.required, Validators.min(0)]],
      pricePerUnitDistance: ['', [Validators.required, Validators.min(0)]],
      pricePerUnitTime: ['', [Validators.required, Validators.min(0)]],
      maxSpace: ['', [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit() {
    const modalElement = document.getElementById('pricingModal');
    if (modalElement) {
      this.modal = new Modal(modalElement);
    }
    this.getallcountry();
    this.getallcity();
    this.getvehicle();
    this.getallpricing();
  }

  ngAfterViewInit(): void {
    this.getallpricing();
  }

  openModal() {
    this.pricingForm.reset();
    this.modal?.show();
  }

  closeModal() {
    this.modal?.hide();
  }


  getallcountry(){
    this.countryservice.getallcountries().subscribe({next: (data:any) => {
      this.countries = data
      console.log(this.countries)
      this.toastr.success('Countries fetched successfully', 'Success');
    }});
  }

  oncountryselected(){
    console.log(this.selectedCountry);
    if (this.selectedCountry) {
      this.allcity = this.cityarray.filter((item) => item.city.toLowerCase().includes(this.selectedCountry.toLowerCase()));
      console.log(this.allcity);
    }
  }

  getallcity(){
    this.cityservice.getallcities().subscribe({next: (data:any) => {
      this.allcity = data;
      this.cityarray = data;
    }})
  }

  getvehicle(){
    this.vehicleservice.getallvehicle().subscribe({next: (data:any) => {
      this.allvehicle = data;
      console.log(this.allvehicle);
    }});
   }

   getallpricing(){
    this.vehiclepricing.getallpricing().subscribe({next: (data:any) =>{
      this.savedPricingData = data
      console.log(this.savedPricingData);
      this.toastr.success('Pricing fetched successfully', 'Success');
    },
    error: () => {
      this.toastr.error('Failed to fetch Pricing', 'Error');
    }})
   }

   updataingpricing(data?:string){
    if(this.editing){
      this.saveformdata();
    this.requpdate(this.pricingdata,this.specificpricing[0]._id);
     this.closeModal();
     this.pricingForm.reset;
     this.getallpricing();
     this.editing = false
    }else{
    this.editing = true
    const id = data?.trim();
    this.specificpricing = this.savedPricingData.filter(item => item.type.toString() == id);
    if (this.specificpricing.length > 0) {
      this.openModal();
      this.pricingForm.patchValue(this.specificpricing[0]);}
   }
  }
  

  onSubmit() {
    this.saveformdata();
    this.savepricing(this.pricingdata)
    this.closeModal();
    this.pricingForm.reset;
    this.getallpricing();
  }

  saveformdata(){
    this.pricingdata ={
      country: this.selectedCountry,
      city: this.selectedCity,
      type: this.selectedTypeid,
      driverProfit:this.pricingForm.get('driverProfit')?.value,
      minFare:this.pricingForm.get('minFare')?.value,
      baseDistance:this.pricingForm.get('baseDistance')?.value,
      basePrice:this.pricingForm.get('basePrice')?.value,
      pricePerUnitDistance:this.pricingForm.get('pricePerUnitDistance')?.value,
      pricePerUnitTime:this.pricingForm.get('pricePerUnitTime')?.value,
      maxSpace:this.pricingForm.get('maxSpace')?.value
    }
  }

  savepricing(data:any){
    this.vehiclepricing.savepricing(data).subscribe({next: ()=> {
      this.toastr.success('Pricing saved successfully', 'Success');
    }});
  }

  requpdate(data:any,id:string){
    this.vehiclepricing.updatepricing(data,id).subscribe({next: ()=> {
      this.toastr.success('Pricing updated successfully', 'Success');
    }})
    this.getallpricing();
  }



  
}
