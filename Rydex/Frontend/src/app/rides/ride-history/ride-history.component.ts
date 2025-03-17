import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RideDetailsComponent } from '../confirm-ride/ride-details/ride-details.component';
import { ConfirmrideService } from '../../services/confirmride.service';

@Component({
  selector: 'app-ride-history',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule,RideDetailsComponent],
  templateUrl: './ride-history.component.html',
  styleUrl: './ride-history.component.css'
})
export class RideHistoryComponent {
  rides: any[] = [];
  selectedride!: string
  isopen:boolean = false
  confirmrideservice:ConfirmrideService = inject(ConfirmrideService)

  ngOnInit(): void {
  this.loadRides()
  }

  loadRides(): void {
    this.confirmrideservice.ridehistory().subscribe({next: (data:any) => {
      this.rides = data
      console.log(this.rides);
    }})
    
  }

  onrideclick(data:any){
    this.selectedride = data;
    this.isopen = true;
  }
  onclose(){
    this.isopen = false
  }
}
