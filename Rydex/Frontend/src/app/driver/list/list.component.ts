import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CountryService } from '../../services/country.service';
import { CityService } from '../../services/city.service';
import { DriverService } from '../../services/driver.service';
import { VehiclepricingService } from '../../services/vehiclepricing.service';
import { VehicletypeService } from '../../services/vehicletype.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [FormsModule,ReactiveFormsModule,CommonModule],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export class ListComponent {

  drivers: any[] = [];
  isModalOpen = false;
  isServiceModalOpen = false;
  isEditing = false;
  driverForm: FormGroup;
  searchquery = '';
  totalpage!: number;
  currentpage: number = 1;
  sorting: string = "";
  currentUserId!: string ;
  currentdriverid!: string ;
  countries: any[] = [];
  selectedcountry!: string;
  selectedservice!: string;
  cities: any[] = [];
  citiesarray: any[] = [];
  services: any[] = [];
  countryservice: CountryService = inject(CountryService);
  cityservice: CityService = inject(CityService);
  driverservice: DriverService = inject(DriverService);
  vehicleservice: VehicletypeService = inject(VehicletypeService)
  imagefile: any = '';
  private toastr = inject(ToastrService);


  constructor(private fb: FormBuilder) {
    this.driverForm = this.fb.group({
      profile: [''],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email , this.emailduplicateValidator]],
      country: ['', Validators.required],
      city: ['', Validators.required],
      phone: ['', [Validators.required ,this.phoneduplicateValidator, Validators.pattern(/^[0-9]{10}$/)]]
    });
  }

  emailduplicateValidator = (control: { value: any; }) => {
    const email = control.value;
    const isDuplicate = this.drivers.some(user => user.email === email);
    return isDuplicate ? { 'duplicate': true } : null;
  }

  phoneduplicateValidator = (control: { value: any; }) => {
    const phone = control.value;
    const isDuplicate = this.drivers.some(user => user.phone === phone);
    return isDuplicate ? { 'duplicate': true } : null;
  }

  ngOnInit() {
    this.getdrivers();
    this.loadCountries();
    
  }

  getdrivers() {
    this.driverservice.getdriver(this.currentpage, this.searchquery, this.sorting).subscribe({
      next: (data: any) => {
        this.drivers = data.results
        const length = data.datalength.length;
        this.totalpage = Math.ceil(length / 3);
        console.log(data);
        this.toastr.success('Drivers fetched successfully', 'Success');
      },
      error: () => {
        this.toastr.error('Failed to fetch Drivers', 'Error'); 
      }
    });
  }

  loadCountries() {
    this.countryservice.getallcountries().subscribe({next: (data:any) => {
      this.countries = data
      console.log(this.countries)
      this.toastr.success('Countries fetched successfully', 'Success');
    },
    error: () => {
      this.toastr.error('Failed to fetch Countris', 'Error'); 
    }});
    
  }

  loadCities() {
    this.cityservice.getallcities().subscribe({
      next: (data: any) => {
        this.citiesarray = data;
        this.cities = data;
        this.cities = this.citiesarray.filter((item) => item.city.toLowerCase().includes(this.selectedcountry.toLowerCase()));
        this.toastr.success('City fetched successfully', 'Success');
      },
      error: () => {
        this.toastr.error('Failed to fetch City', 'Error'); 
      }
  })
  }
  onCountryChange(event: any) {
    this.selectedcountry = event.target.value 
    console.log(this.selectedcountry);
    this.loadCities();
  }

  onservicechange(event: any) {
    this.selectedservice = event.target.value 
    console.log(this.selectedservice);
  }

  openModal() {
    this.isModalOpen = true;
    this.isEditing = false;
    this.driverForm.reset();
  }

  closeModal() {
    this.isModalOpen = false;
    this.driverForm.reset();
    this.isServiceModalOpen = false;
    this.imagefile = ""
  }

  editDriver(driver: any) {
    console.log(driver);
    this.isModalOpen = true;
      this.isEditing = true;
      this.selectedcountry = driver.country
      this.loadCities()
      this.driverForm.patchValue({
        name: driver.name,
        email: driver.email,
        phone: driver.phone,
        country: driver.country,
        city: driver.city
      });
      this.currentUserId = driver._id;

  }

  deleteDriver(id: string) {
    this.driverservice.deletedriver(id).subscribe({next: ()=> {
      console.log('user deleted');
      this.toastr.success('Driver deleted successfully', 'Success');
    },
    error: () => {
      this.toastr.error('Failed to delete Driver', 'Error'); 
    }})
    this.getdrivers();
  }

  onclicksorting(field:string){
    this.sorting = field;
    this.getdrivers();
  }

  uploadimage(event: any) {
    this.imagefile = (event.target as HTMLInputElement)?.files?.[0];
    console.log('Uploading image:', this.imagefile);
  }

  onSubmit() {
    const formData = new FormData
    formData.append('profile', this.imagefile)
    formData.append('name', this.driverForm.get('name')?.value)
    formData.append('email', this.driverForm.get('email')?.value)
    formData.append('country', this.driverForm.get('country')?.value)
    formData.append('city', this.driverForm.get('city')?.value)
    formData.append('phone', this.driverForm.get('phone')?.value)

    if (this.isEditing && this.currentUserId) {
      const driverid = this.currentUserId;
      this.driverservice.updatedriver(formData,driverid).subscribe({next:() => {
        this.getdrivers();
        this.closeModal();
        this.toastr.success('Driver Updated successfully', 'Success');
      },
      error: () => {
        this.toastr.error('Failed to update Drivers', 'Error'); 
      }});
    } else {
      console.log(formData);
      this.driverservice.adddriver(formData).subscribe({next:() => {
      this.getdrivers();
      this.closeModal();
      this.toastr.success('Driver added successfully', 'Success');
    },
    error: () => {
      this.toastr.error('Failed to add Drivers', 'Error'); 
    }});}
  }

 

  changepage(page: number) {
    this.currentpage = page;
    this.getdrivers();
  }

  toggleSwitch(driver:any,id:string) {
    console.log(driver);
    const ischeked = !driver
    console.log(ischeked);
    this.driverservice.driverstatus({status:ischeked},id).subscribe(() => {
    });
    this.getdrivers()
  }


  servicetype(driver:string){
    this.currentdriverid = driver;
    this.isServiceModalOpen = true;
    this.vehicleservice.getallvehicle().subscribe((data:any) => {
      this.services = data;
      console.log(this.services);
    });
  }

  addservice(){
    const data = {
      driverid: this.currentdriverid,
      serviceid: this.selectedservice
    }
    this.driverservice.addservice(data).subscribe(() => {

    });
    this.getdrivers();

  }


}
