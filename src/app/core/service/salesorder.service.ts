import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ReportFilter } from '../../shared/model/commonreport';
import { Observable, of } from "rxjs";
import { prepareHttpParams } from '../../_helpers/utils'
@Injectable({
  providedIn: 'root'
})
export class SalesorderService {
  salesorderDataCache: any[] = [];
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
    private router: Router
  ) { }

  async getSalesOrder() {
    if (!(this.salesorderDataCache.length > 0)) {
      const data = await this.http.get<any[]>(this.apiUrl + "/SoHeaders", this.httpOptions).toPromise();
      this.salesorderDataCache = data;
      return data;
    }
    else {
      return this.salesorderDataCache;
    }
  }
  async onRefreshsalesorder() {
    const data = await this.http.get<any[]>(this.apiUrl + "/SoHeaders", this.httpOptions).toPromise();
    if (data == null) {
      this.salesorderDataCache = [];
    } else {
      this.salesorderDataCache = data;
    }
    return this.salesorderDataCache;
  }

  getSalesOrderdetails(id: number) {
    return this.http.get<any>(this.apiUrl + "/" + id, this.httpOptions).pipe(tap((res: any) => {
      return res;
    }));
  }

  getSalesOrderSummary(id: number) {
    return this.http.get<any>(this.apiUrl + "/sosummary/" + id, this.httpOptions).pipe(tap((res: any) => {
      return res;
    }));
  }
  // sales order return
  getSalesOrderReturnSummary(id: number) {
    return this.http.get<any>(this.apiUrl + "/soreturnSummary/" + id, this.httpOptions).pipe(tap((res: any) => {
      return res;
    }));
  }

  // sales order report

  getSalesOrderReport(filters: ReportFilter, mastertype: string): Observable<any[]> {
    let url = mastertype == "salesorderreport" ? this.apiUrl + "/SoHeaders" : this.apiUrl + "/SoreturnHeader"
    return this.http.get<any[]>(url, { params: prepareHttpParams(filters) }).pipe(tap((res: any[]) => {
      return res;
    }));
  }





}
