import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfirmrideService {

  constructor(private http:HttpClient) { }

  loadrides(selectedvehicletype:string,selectedstatus:string,searchquery:string){
    return this.http.get(`http://localhost:8000/confirm-ride?selectedvehicletype=${selectedvehicletype}&searchquery=${searchquery}&selectedstatus=${selectedstatus}`)
  }
  getdriver(data:string){
    return this.http.get(`http://localhost:8000/confirm-ride/driver?vehicle=${data}`)
  }

  assignselected(data:any){
    return this.http.post('http://localhost:8000/confirm-ride',data)
  }

  assignrandom(data:any){
    return this.http.post('http://localhost:8000/confirm-ride/random',data)
  }

  ridehistory(){
    return this.http.get('http://localhost:8000/confirm-ride/ridehistory')
  }

  
}
