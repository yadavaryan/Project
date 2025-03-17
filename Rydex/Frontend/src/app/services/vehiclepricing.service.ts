import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VehiclepricingService {

  constructor(private http:HttpClient) { }

  savepricing(data:any): Observable<any>{
    return this.http.post('http://localhost:8000/pricing',data)
  }

  getallpricing(): Observable<any>{
    return this.http.get('http://localhost:8000/pricing')
  }

  updatepricing(data:any,id:any): Observable<any>{
    return this.http.put(`http://localhost:8000/pricing?id=${id}`,data)
  }
}
