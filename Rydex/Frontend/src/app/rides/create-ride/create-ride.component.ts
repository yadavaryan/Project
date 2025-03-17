import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, QueryList, ViewChild, viewChild, ViewChildren } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { CreaterideService } from '../../services/createride.service';
import { GoogleMapsModule } from '@angular/google-maps';
import { VehicletypeService } from '../../services/vehicletype.service';
import { VehiclepricingService } from '../../services/vehiclepricing.service';
import { scheduled } from 'rxjs';

@Component({
  selector: 'app-create-ride',
  standalone: true,
  imports: [FormsModule,CommonModule,ReactiveFormsModule,GoogleMapsModule],
  templateUrl: './create-ride.component.html',
  styleUrl: './create-ride.component.css'
})
export class CreateRideComponent {

  rideForm: FormGroup;
  vehicles: any[] = [];
  savedPricingData: any[] = [];
  waypoints: any[] = [];
  addrstops: any[] = [];
  userExists = false;
  mapVisible = false;
  estimatedTime: string  = ""
  estimatedDistance: string = ""
  estimatedprice!: any 
  numbervalid: boolean = false;
  map!: google.maps.Map;
  pickup_place!: any;
  drop_place!: any;
  user:any;
  selectedvehicle!:string
  countrycode!: string;
  directionsService!: google.maps.DirectionsService
  directionsRenderer!: google.maps.DirectionsRenderer
  @ViewChild('pickup') pickup! : ElementRef
  @ViewChild('drop') drop! : ElementRef
  @ViewChildren('stopInput') stopInputs!: QueryList<ElementRef>;
  createrideservice: CreaterideService = inject(CreaterideService);
  vehicleservice: VehicletypeService = inject(VehicletypeService);
  vehiclepricing: VehiclepricingService = inject(VehiclepricingService)

  constructor(private fb: FormBuilder) {
    this.rideForm = this.fb.group({
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      userName: [''],
      userEmail: [''],
      pickupLocation: ['' , Validators.required],
      dropLocation: ['', Validators.required],
      stops: this.fb.array([]),
      paymentMethod: ['cash', Validators.required],
      bookingType: ['now', Validators.required],
      scheduleDateTime: ['']
    });
  }

  ngOnInit(): void {
    this.directionsService = new google.maps.DirectionsService()
    this.directionsRenderer = new google.maps.DirectionsRenderer()
    this.getvehicle()
    this.getallpricing()
  }

  ngAfterViewInit() {
    this.initmap();
    this.directionsRenderer.setMap(this.map)

  }

  onPhoneNumberSubmit(): void {
    const phoneNumber = this.rideForm.get('phoneNumber')?.value
    this.createrideservice.verifyuser(phoneNumber).subscribe({next: (data:any) => {
      this.rideForm.patchValue({
        userName:data.name,
        userEmail:data.email
      })
      if(data){
        this.numbervalid = true
      }
      this.user = data.userId
      this.countrycode = data.country
    }})
  }

  initmap() {
    const mapDiv = document.getElementById('map');
    if (!mapDiv) {
      console.error('Map container not found!');
      return;
    }

    this.map = new google.maps.Map(mapDiv, {
      zoom: 12,
      center: { lat: 22.3087, lng: 70.7989 },
    });

  }

  initautocomplete() {
    if (!this.pickup?.nativeElement) {
      console.error('pickup input not found!');
      return;
    }

    const options = {
      componentRestrictions: { country: this.countrycode  },
    };

    const autocomplete = new google.maps.places.Autocomplete(this.pickup.nativeElement,options);
    autocomplete.addListener('place_changed', () => {
      this.pickup_place = autocomplete.getPlace()
    });
  }


  initdrop() {
    if (!this.drop?.nativeElement) {
      console.error('drop input not found!');
      return;
    }
    const options = {
      componentRestrictions: { country: this.countrycode  },
    };
    const autocomplete = new google.maps.places.Autocomplete(this.drop.nativeElement,options);
    autocomplete.addListener('place_changed', () => {
      this.drop_place = autocomplete.getPlace()
      console.log(this.waypoints);
      setTimeout(() => {
        this.calculatepath()
      }, 500);
    });
  }


  autocompleteformarray(index:number){
    if(!this.stops.at(index)){
      console.error('stop input not found!');
      return;
    }
    const options = {
      componentRestrictions: { country: this.countrycode  },
    };
    const stopInputElement = this.stopInputs.get(index)?.nativeElement;
    const autocomplete = new google.maps.places.Autocomplete(stopInputElement,options);
    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
        if (place.geometry?.location) {
          const location = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          };

          this.waypoints.push({
            location, 
            stopover: true, 
          });
          this.addrstops.push(place.formatted_address)
          this.calculatepath()
        }});


  }


    calculatepath(){
   
    const request = {
      origin: this.pickup_place.geometry.location,
      destination : this.drop_place.geometry.location,
      waypoints:this.waypoints,
      travelMode : google.maps.TravelMode.DRIVING,
    };
   console.log(request);
    this.directionsService.route(request ,(result,status) => {
      if (status == "OK") {
        this.directionsRenderer.setDirections(result);
        console.log(result);
        result?.routes.forEach((route: any) => {
          let totalDistance = 0
          let totalTime = 0
          route.legs.forEach((leg: any) => {
            totalDistance += leg.distance.value; 
            totalTime += leg.duration.value;     
          });
          this.estimatedDistance = (totalDistance / 1000).toFixed(2) + ' km'; 
          this.estimatedTime = (totalTime / 60).toFixed(0) + ' mins';        
        });


      } else {
        console.error("Directions request failed due to " + status);
      }
    });
   
  }

  getallpricing(){
    this.vehiclepricing.getallpricing().subscribe({next: (data:any) =>{
      this.savedPricingData = data
      console.log(this.savedPricingData);
    },
    error: () => {
    }})
   }

  calculatefare(data:any){
    const currentvehicle = this.savedPricingData.filter(vehicle => vehicle.type === data);
    const totalDistance = parseFloat(this.estimatedDistance?.split(' ')[0]);
    const totalTime =  parseInt(this.estimatedTime?.split(' ')[0]);
    const basePrice = +currentvehicle[0].basePrice
    const basePriceDistance = +currentvehicle[0].baseDistance
    const unitDistancePrice = +currentvehicle[0].pricePerUnitDistance
    const unitTimePrice = +currentvehicle[0].pricePerUnitTime
    const minFare = +currentvehicle[0].minFare
    const distancePrice = Math.max(totalDistance - basePriceDistance, 0) * unitDistancePrice;

    const timePrice = totalTime * unitTimePrice;

    const totalFare = basePrice + distancePrice + timePrice;

    const serviceFee = Math.max(totalFare, minFare).toFixed(2);

    return serviceFee? serviceFee : '$'
  }

  updateFare(data:any){
    this.selectedvehicle = data
    this.estimatedprice = this.calculatefare(data)
  }

   get stops() {
    return this.rideForm.get('stops') as FormArray;
  }

  createStop(): FormGroup {
    return this.fb.group({
      location: ['', Validators.required]
    });
  }

  addStop(): void {
    this.stops.push(this.createStop());
  }

  removeStop(index: number): void {
    this.stops.removeAt(index);
    this.waypoints.splice(index,1);
    this.calculatepath();

  }

 

  getvehicle(){
    this.vehicleservice.getallvehicle().subscribe({next: (data:any) => {
      this.vehicles = data
      console.log(this.vehicles)
    }})
  }

  onBookingTypeChange(): void {
  }

  bookRide(): void {
   const ride = {
    user:this.user,
    pickup:this.pickup.nativeElement.value,
    drop:this.drop.nativeElement.value,
    stop:this.addrstops,
    selectedvehicle:this.selectedvehicle,
    paymentMethod:this.rideForm.get("paymentMethod")?.value,
    bookingType:this.rideForm.get("bookingType")?.value,
    scheduleAt:this.rideForm.get('scheduleDateTime')?.value,
    distance:this.estimatedDistance,
    duration:this.estimatedTime,
    fare:this.estimatedprice
   }

   this.createrideservice.bookride(ride).subscribe({next: ()=> {

   }})

   this.numbervalid = false;
   this.rideForm.reset();
   this.initmap();
   this.estimatedDistance = ''
   this.estimatedTime = ''
   this.estimatedprice = ''
   
   

  }
}
