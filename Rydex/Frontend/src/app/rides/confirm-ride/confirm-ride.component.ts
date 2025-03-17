import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfirmrideService } from '../../services/confirmride.service';
import { RideDetailsComponent } from './ride-details/ride-details.component';
import { VehicletypeService } from '../../services/vehicletype.service';
import { SoketService } from '../../services/soket.service';
import { PushnotificationService } from '../../services/pushnotification.service';

@Component({
  selector: 'app-confirm-ride',
  standalone: true,
  imports: [FormsModule,CommonModule,ReactiveFormsModule,RideDetailsComponent],
  templateUrl: './confirm-ride.component.html',
  styleUrl: './confirm-ride.component.css'
})
export class ConfirmRideComponent {

  rides: any[] = [];
  drivers: any[] = [];
  selectedride: any;
  selectedridefor: any;
  service: any;
  isopen:boolean = false
  isdriverModalOpen:boolean = false
  assignRandom:boolean = false
  assignSelected:boolean = false
  selectedvehicletype: string = '';
  selectedstatus: string = '';
  searchquery: string = '';
  selectedDriver: string = '';
  confirmrideservice:ConfirmrideService = inject(ConfirmrideService);
  vehicleservice:VehicletypeService = inject(VehicletypeService);
  soketservice:SoketService = inject(SoketService);
  notificationService: PushnotificationService = inject(PushnotificationService)
  vehicleTypes: any[] = [];
  statusList: string[] = ['Pending','Assigned', 'Accepted', 'Arrived', 'Picked', 'Started', 'Completed'];


  ngOnInit(): void {
    this.loadRides();
    this.getvehicle();
    this.soketservice.on('rideUpdate', (data: { rideId: string; status: string }) => {
      
        const index = this.rides.findIndex( (r) => r._id == data.rideId)
        this.rides[index].status = data.status;
        console.log('Ride status updated to:', data.status);
      
    });
    this.soketservice.on('ride', (data:any) => {
      this.loadRides()
    })
  }

  loadRides(): void {
    this.confirmrideservice.loadrides(this.selectedvehicletype,this.selectedstatus,this.searchquery).subscribe({next: (data:any) => {
      this.rides = data
      console.log(this.rides);
    }})
  }

  getvehicle(){
    this.vehicleservice.getallvehicle().subscribe({next : (data:any) => {
      this.vehicleTypes = data
    }})
  }

  onrideclick(data:any){
    this.selectedride = data;
    this.isopen = true;
  }
  onclose(){
    this.isopen = false
  }

  closeModal(){
    this.isdriverModalOpen = false
  }


  applyfilters(){
    this.loadRides()
  }

  assignDriver(vehicles: string,ride:string): void {
    this.selectedridefor = ride
    this.service = vehicles
    setTimeout(() => {
      this.isopen = false
    }, 1);
    this.isdriverModalOpen = true
    this.confirmrideservice.getdriver(vehicles).subscribe({next: (data:any) => {
      this.drivers = data
    }})
  }

  assignRandomDriver(){
    const data = {
      service: this.service,
      ride: this.selectedridefor
    }
    this.confirmrideservice.assignrandom(data).subscribe({next: () => {
      
    }})
    this.closeModal()
  }

  assignSelectedDriver(){
    const data = {
      driver: this.selectedDriver,
      ride: this.selectedridefor
    }
    this.confirmrideservice.assignselected(data).subscribe({next: () => {
      
    }})
    this.closeModal()
  }



  formatTime(date: Date): string {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  }


  triggerNotification() {
    this.notificationService.showNotification('Hello!', {
      body: 'This is a push notification.',
      icon: '/assets/icons/icon-72x72.png',
    });
  }
}
