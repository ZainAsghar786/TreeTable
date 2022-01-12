import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class HttpRequestService {
  constructor(private http: HttpClient) {}
  // http://localhost:3000/v1/menu1/newCol
  private url: string = 'http://localhost:3000' + '/v1/';
  //private url: string = 'http://139.59.36.91/SalesAssistApi/api/';

  getRequest(addr): Observable<any> {
    return this.http.get(this.url + addr);
  }
  postRequest(addr, Data): Observable<any> {
    return this.http.post(this.url + addr, Data);
  }
  putRequest(addr, Data): Observable<any> {
    return this.http.put(this.url + addr, Data);
  }
}
