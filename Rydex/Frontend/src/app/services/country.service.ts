import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CountryService {

  constructor(private http:HttpClient) { }

    errorSubject = new Subject<HttpErrorResponse>();
   
    fetchcountry(countryName:string){
      return this.http.get(`https://restcountries.com/v3.1/name/${countryName}?fullText=true`)
    }

    createcountry(data: any){
      return this.http.post('http://localhost:8000/country',data);
    }

    getallcountries(){
      return this.http.get('http://localhost:8000/country')
    }
}
