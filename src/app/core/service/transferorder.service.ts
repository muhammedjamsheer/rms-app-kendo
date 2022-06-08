import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ToManualReceiptModel } from 'src/app/shared/model/transferorder';

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
  gettransferorderdetails(id: string) {
    return this.http.get<any>(this.apiUrl + "/" + id, this.httpOptions).pipe(tap((res: any) => {
      return res;
    }));
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

  createManualTransferOrderReceipt(data: ToManualReceiptModel) {
    return this.http.post<any>(this.apiUrlToManualReceipt, data, this.httpOptions).pipe(tap((res: any) => {
      return res;
    }));
  }
}
