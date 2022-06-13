import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TransferreturnService {
  transferReturnDataCache: any[] = [];
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
  constructor(
    private http: HttpClient,
  ) { }

  async getTransferReturn() {
    if (!(this.transferReturnDataCache.length > 0)) {
      const data = await this.http.get<any[]>(this.apiUrl + "/ToreturnHeader", this.httpOptions).toPromise();
      if (data != null) {
        this.transferReturnDataCache = data;
      }
      return this.transferReturnDataCache;
    }
    else {
      return this.transferReturnDataCache;
    }
  }
  async onRefreshTransferReturn() {
    const data = await this.http.get<any[]>(this.apiUrl + "/ToreturnHeader", this.httpOptions).toPromise();
    if (data == null) {
      this.transferReturnDataCache = [];
    } else {
      this.transferReturnDataCache = data;
    }
    return this.transferReturnDataCache;
  }

  getTransferReturndetails(id: number) {
    return this.http.get<any>(this.apiUrl + "/" + id, this.httpOptions).pipe(tap((res: any) => {
      return res;
    }));
  }
}
