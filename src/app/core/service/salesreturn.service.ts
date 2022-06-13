import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SalesreturnService {
  salesOrderReturnDataCache: any[] = [];

  token = localStorage.getItem('access_token');
  selectedrowevent = new Subject<any>();
  refreshClickevent = new Subject<any>();
  headers = new HttpHeaders()
    .set('Authorization', "Bearer " + this.token)
    .set('Content-Type', 'application/json');;
  httpOptions = {
    headers: this.headers
  };
  private apiUrl = `${environment.apiUrl}/salesOrder`;
  constructor(
    private http: HttpClient,
  ) { }

  async getSalesReturn() {
    debugger;
    if (!(this.salesOrderReturnDataCache.length > 0)) {
      const data = await this.http.get<any[]>(this.apiUrl + "/SoreturnHeader", this.httpOptions).toPromise();
      this.salesOrderReturnDataCache = data;
      return data;
    }
    else {
      return this.salesOrderReturnDataCache;
    }
  }
  async onRefreshSalesOrderReturn() {
    const data = await this.http.get<any[]>(this.apiUrl + "/SoreturnHeader", this.httpOptions).toPromise();
    if (data == null) {
      this.salesOrderReturnDataCache = [];
    } else {
      this.salesOrderReturnDataCache = data;
    }
    return this.salesOrderReturnDataCache;
  }
  getSalesOrderReturnSummary(id: number) {
    return this.http.get<any>(this.apiUrl + "/soreturnSummary/" + id, this.httpOptions).pipe(tap((res: any) => {
      return res;
    }));
  }
  getSalesOrderReturndetails(id: number) {
    return this.http.get<any>(this.apiUrl + "/" + id, this.httpOptions).pipe(tap((res: any) => {
      return res;
    }));
  }
}
