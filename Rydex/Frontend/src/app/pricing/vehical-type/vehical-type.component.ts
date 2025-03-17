import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { VehicletypeService } from '../../services/vehicletype.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-vehical-type',
  standalone: true,
  imports: [ReactiveFormsModule,HttpClientModule,CommonModule],
  templateUrl: './vehical-type.component.html',
  styleUrl: './vehical-type.component.css'
})
export class VehicalTypeComponent {

  title = 'reactive-form';
  reactiveForm!: FormGroup;
  vehicleservice: VehicletypeService = inject(VehicletypeService);
  imagefile : any
  vehicle: any[] = []
  http: any;
  editing: boolean = false;
  selectedVehicleId!: string;
  private toastr = inject(ToastrService);

 
  
  
  
  ngOnInit(): void {
   this.reactiveForm = new FormGroup({
    vehicletype:new FormControl(null,Validators.required),
    vehicleicon:new FormControl(null)
   })
   this.getvehicle();
    
  }
 
  CreatorUpdateVehicle(data:FormData){
    console.log(this.editing)
    if(!this.editing){
    this.vehicleservice.createVehicle(data).subscribe({next: ()=> {
      console.log('created')
      this.getvehicle();
      this.toastr.success('Vehicle added successfully', 'Success');
    }});
    }else{
      this.vehicleservice.UpdateVehicle(this.selectedVehicleId,data).subscribe({next: ()=> {
        console.log('edited')
        this.getvehicle();
        this.toastr.success('Vehicle updated successfully', 'Success');
      }});
    }
  }

  uploadimage(event:Event){
    this.imagefile = (event.target as HTMLInputElement)?.files?.[0];
    
  }
 

  onFormSubmit() {
    const formData = new FormData();
    formData.append('vehicletype', this.reactiveForm.get('vehicletype')?.value);
    formData.append('vehicleicon',this.imagefile)
    console.log(this.reactiveForm.value)
    this.CreatorUpdateVehicle(formData)
    this.reactiveForm.reset();
    this.imagefile = ""

}

  getvehicle(){
    this.vehicleservice.getallvehicle().subscribe({next: (data:any) => {
      this.vehicle = data
      console.log(this.vehicle)
    }});
  }

 onUpdateform(id: string){
  this.editing = true;
  console.log(this.editing)
  this.selectedVehicleId = id
  const filteredVehicle = this.vehicle.filter(vehicle => vehicle._id === id);
  console.log(filteredVehicle);
  this.reactiveForm.patchValue(filteredVehicle[0])
  
}
  
}
