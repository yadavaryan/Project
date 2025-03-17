import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RunningService } from '../../services/running.service';
import { RideDetailsComponent } from '../../rides/confirm-ride/ride-details/ride-details.component';
import { SoketService } from '../../services/soket.service';

@Component({
  selector: 'app-running-request',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule,RideDetailsComponent],
  templateUrl: './running-request.component.html',
  styleUrl: './running-request.component.css'
})
export class RunningRequestComponent {

  rides: any[] = [];
  selectedride!: string
  selectedstatus: string = ''
  isopen:boolean = false
  isaccepted:boolean = false
  assignRandom:boolean = false
  assignSelected:boolean = false
  remainingseconds:number = 30
  runningservice: RunningService = inject(RunningService)
  soketservice:SoketService = inject(SoketService);

  ngOnInit(): void {
    this.loadRides();
    this.soketservice.on('rideUpdate', (data: { rideId: string; status: string }) => {
      
        const index = this.rides.findIndex( (r) => r._id == data.rideId)
        this.rides[index].status = data.status;
        console.log('Ride status updated to:', data.status);
        console.log('Ride status updated to:', data.status);
      
    });
    this.soketservice.on('ride', (data:any) => {
      this.loadRides()
    })
    this.timerfunc();

  }

  loadRides(): void {
    this.runningservice.loadrides().subscribe({next: (data:any) => {
      this.rides = data
      console.log(this.rides);
    }})
    
  }

  updatestatus(status:string, rideId:string){
    this.soketservice.emit('rideUpdate', {rideId:rideId ,status: status });
    this.selectedstatus = ''
  }

  onrideclick(data:any){
    this.selectedride = data;
    this.isopen = true;
  }
  onclose(){
    this.isopen = false
  }
  onDropdownClick(event: Event) {
    event.stopPropagation();
  }

  accept(event: Event,rideId:string){
    event.stopPropagation();
    this.isaccepted = true
    const index = this.rides.findIndex( (r) => r._id == rideId)
    this.rides[index].status = 'Accepted' ;
    this.updatestatus("Accepted",rideId)
    this.loadRides();
  }

  reject(event: Event,rideoption:string,rideId:string){
    event.stopPropagation();
    this.isaccepted = false
    console.log(rideoption);
    if(rideoption === 'selected'){
      this.runningservice.reassignride(rideId).subscribe({next: () => {
        this.loadRides();
      }})
    }else{
      this.runningservice.randomreassign(rideId).subscribe({next: () => {
        
      }})
    }

  }

  calculatetime(data:any){
    const currenttime = new Date().getTime()
    const assigntime = new Date(data).getTime()
    const timeleft = Math.max(0,(30*1000 - ( currenttime - assigntime ))) 
    return Math.floor(timeleft / 1000)
  }

  timerfunc(){
    console.log('this.remainingseconds: ', this.remainingseconds);
    const timer = setInterval(() => {
      this.rides.forEach( (r) => {
        r.time = this.calculatetime(r.assignAt)
      })
    }, 1000);
 
    
  }
}
