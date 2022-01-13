import { Injectable } from '@angular/core';
import { HttpRequestService } from './http-request.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Subject, BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MasterDataService {
  constructor(private http: HttpRequestService) {}

  // #region Product
  private _tableData: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public readonly tableData: Observable<any> = this._tableData.asObservable();

  loadTableData() {
    this.http.getRequest('menu1/getall').subscribe(
      (data) => {
        console.log(data);
        this._tableData.next(JSON.parse(JSON.stringify(data)));
      },
      (err: HttpErrorResponse) => {
        console.log('Error retrieving Product');
        this.http.showTost('error', 'Request Failed', 'Something went wrong!');
      }
    );
  }

  //#endregion */
}
