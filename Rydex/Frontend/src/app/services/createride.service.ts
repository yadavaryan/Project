import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CreaterideService {

  constructor(private http:HttpClient) { }

  verifyuser(data:number){
    return this.http.post('http://localhost:8000/createride/verify',{data})
  }

  bookride(data:any){
    return this.http.post('http://localhost:8000/createride',data)
  }
}
