import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ToManualReceiptModel } from 'src/app/shared/model/transferorder';
import { ReportFilter } from '../../shared/model/commonreport';
import { Observable, of } from "rxjs";
import { prepareHttpParams } from '../../_helpers/utils'
@Injectable({
  providedIn: 'root'
})
export class TransferorderService {

  transferorderDataCache: any[] = [];
  token = localStorage.getItem('access_token');
  selectedrowevent = new Subject<any>();
  refreshClickevent = new Subject<any>();
  headers = new HttpHeaders()
    .set('Authorization', "Bearer " + this.token)
    .set('Content-Type', 'application/json');;
  httpOptions = {
    headers: this.headers
  };
  private apiUrl = `${environment.apiUrl}/transferOrder`;
  private apiUrlToManualReceipt = `${environment.apiUrl}/Receipt/ToManualReceipt`;

  constructor(
    private http: HttpClient,
  ) { }

  async gettransferorders() {
    if (!(this.transferorderDataCache.length > 0)) {
      const data = await this.http.get<any[]>(this.apiUrl + "/ToHeaders", this.httpOptions).toPromise();
      this.transferorderDataCache = data;
      return data;
    }
    else {
      return this.transferorderDataCache;
    }
  }
  async onRefreshtransferorder() {
    const data = await this.http.get<any[]>(this.apiUrl + "/ToHeaders", this.httpOptions).toPromise();
    if (data == null) {
      this.transferorderDataCache = [];
    } else {
      this.transferorderDataCache = data;
    }
    return this.transferorderDataCache;
  }

  getTransferOrderDetails(id: number) {
    return this.http.get<any>(this.apiUrl + "/" + id, this.httpOptions).pipe(tap((res: any) => {
      return res;
    }));
  }

  getTransferOrderSummary(id: number) {
    return this.http.get<any>(this.apiUrl + "/tosummary/" + id, this.httpOptions).pipe(tap((res: any) => {
      return res;
    }));
  }
  getTransferReturnSummary(id: number) {
    return this.http.get<any>(this.apiUrl + "/toreturnSummary/" + id, this.httpOptions).pipe(tap((res: any) => {
      return res;
    }));
  }
  createManualTransferOrderReceipt(data: ToManualReceiptModel) {
    return this.http.post<any>(this.apiUrlToManualReceipt, data, this.httpOptions).pipe(tap((res: any) => {
      return res;
    }));
  }

  getTransferOrderReport(filters: ReportFilter, mastertype: string): Observable<any[]> {
    let url = mastertype == "transferorderreport" ? this.apiUrl + "/ToHeaders" : this.apiUrl + "/ToreturnHeader"
    return this.http.get<any[]>(url, { params: prepareHttpParams(filters) }).pipe(tap((res: any[]) => {
      return res;
    }));
  }
}
