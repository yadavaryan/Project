import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http:HttpClient) { }

  adduser(data:FormData){
    return this.http.post('http://localhost:8000/user',data)
  }

  getusers(currentpage:number,searchquery:string,sorting:string){
    return this.http.get(`http://localhost:8000/user?currentpage=${currentpage}&searchquery=${searchquery}&sorting=${sorting}`)
  }

  updateuser(data:any,id:string){
    return this.http.put(`http://localhost:8000/user?id=${id}`,data)
  }

  deleteuser(id:string){
    return this.http.delete(`http://localhost:8000/user/delete?id=${id}`)
  }

  addcard(data:any){
    return this.http.post('http://localhost:8000/user/addcard',data)
  }

  getcustomercard(id:string){
    return this.http.get(`http://localhost:8000/user/getcard/${id}`)
  }

  savedefault(data:any){
    return this.http.post('http://localhost:8000/user/setdefault',data)
  }

}
