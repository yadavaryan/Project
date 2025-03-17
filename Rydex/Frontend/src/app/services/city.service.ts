import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CityService {

  constructor(private http:HttpClient) { }
 
  savepolygon(data:any){
    return this.http.post('http://localhost:8000/city',data);
  }

  getpolygon(city:any){
    return this.http.get(`http://localhost:8000/city?city=${city}`)
  }

  getallcities(){
    return this.http.get('http://localhost:8000/city/allcity')
  }

  updatepolygon(data:any,city:any){
    return this.http.put(`http://localhost:8000/city/update?city=${city}`,data);
  }
  
}
