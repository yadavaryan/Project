import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RunningService {

  constructor(private http:HttpClient) { }

  loadrides(){
    return this.http.get(`http://localhost:8000/confirm-ride/running`)
  }

  reassignride(data:any){
    return this.http.put(`http://localhost:8000/confirm-ride`,{data})
  }

  randomreassign(data:any){
    return this.http.put('http://localhost:8000/confirm-ride/onreject',{data})
  }
}
