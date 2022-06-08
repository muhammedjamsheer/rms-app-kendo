import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PickListModel } from '../../shared/model/sales-order';

@Injectable({
  providedIn: 'root'
})
export class SalesorderService {
  salesorderDataCache: any[] = [];
  token = localStorage.getItem('access_token');
  selectedrowevent = new Subject<any>();
  refreshClickevent = new Subject<any>();
  headers = new HttpHeaders()
    .set('Authorization', "Bearer " + this.token)
    .set('Content-Type', 'application/json');;
  httpOptions = {
    headers: this.headers
  };
  private apiUrl = `${environment.apiUrl}/salesOrder/SoHeaders`;
  private salesOrderdetails = `${environment.apiUrl}/salesOrder/`;


  constructor(
    private http: HttpClient,
    private router: Router
  ) { }


  async getSalesOrder() {
    if (!(this.salesorderDataCache.length > 0)) {
      const data = await this.http.get<any[]>(this.apiUrl, this.httpOptions).toPromise();
      this.salesorderDataCache = data;
      return data;
    }
    else {
      return this.salesorderDataCache;
    }
  }
  async onRefreshsalesorder() {
    const data = await this.http.get<any[]>(this.apiUrl, this.httpOptions).toPromise();
    if (data == null) {
      this.salesorderDataCache = [];
    } else {
      this.salesorderDataCache = data;
    }
    return this.salesorderDataCache;
  }
  getSalesOrderdetails(id: number) {
    return this.http.get<any>(this.salesOrderdetails + id, this.httpOptions).pipe(tap((res: any) => {
      return res;
    }));
  }
}
