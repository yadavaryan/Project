import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VehicletypeService {
  constructor(private http: HttpClient) {}

  errorSubject = new Subject<HttpErrorResponse>();


  createVehicle(vehicle: FormData) {
    return this.http.post('http://localhost:8000/vehicletype', vehicle)
  }

  getallvehicle() {
    return this.http.get('http://localhost:8000/vehicletype/get')
  };

  UpdateVehicle(id: string , data: FormData) {
    return this.http.put(`http://localhost:8000/vehicletype?id=${id}`,data)

  }


}
