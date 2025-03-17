import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DriverService {

  constructor(private http:HttpClient) { }

  adddriver(data:FormData){
    return this.http.post('http://localhost:8000/driver',data)
  }

  getdriver(currentpage:number,searchquery:string,sorting:string){
    return this.http.get(`http://localhost:8000/driver?currentpage=${currentpage}&searchquery=${searchquery}&sorting=${sorting}`)
  }

  updatedriver(data:any,id:string){
    return this.http.put(`http://localhost:8000/driver?id=${id}`,data)
  }

  deletedriver(id:string){
    return this.http.delete(`http://localhost:8000/driver?id=${id}`)
  }

  driverstatus(data:any,id:string){
    return this.http.post(`http://localhost:8000/driver/status?id=${id}`,data);
  }

  addservice(data:any){
    return this.http.post('http://localhost:8000/driver/service',data);
  }
}
