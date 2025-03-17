import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http:HttpClient) { }

  private isloginSubject = new BehaviorSubject<boolean>(false);
  public islogin = this.isloginSubject.asObservable();


  login(data:any){
    return this.http.post('http://localhost:8000/login',data)
  }

  isloggin(token: any): Observable<boolean> {
    return this.http.get<{ isvalid: boolean }>(`http://localhost:8000/login?token=${token}`).pipe(
      map((response: { isvalid: any; }) => {
        this.isloginSubject.next(response.isvalid);
        return response.isvalid;
      }),
      catchError((error) => {
        if (error.status === 401) {
          console.error('Token is invalid or expired.');
        } else {
          console.error('An unexpected error occurred:', error);
        }
        return of(false); 
      })
    );
  }

  getisloggedin(): any {
    console.log( this.isloginSubject.value);
    return this.isloginSubject.value;
  }

  logout(){
    localStorage.removeItem('token');
    this.isloginSubject.next(false)
  }
  
  
}
