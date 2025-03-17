import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SettingService {

  constructor(private http:HttpClient) { }

  savesettings(data:any): Observable<any>{
    return this.http.post('http://localhost:8000/setting',data);
  }
  getsetting(): Observable<any>{
    return this.http.get('http://localhost:8000/setting');
  }
}
