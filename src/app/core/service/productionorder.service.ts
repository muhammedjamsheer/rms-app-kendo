import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductionorderService {
  productionorderDataCache: any[] = [];
  token = localStorage.getItem('access_token');
  selectedrowevent = new Subject<any>();
  refreshClickevent = new Subject<any>();
  headers = new HttpHeaders()
    .set('Authorization', "Bearer " + this.token)
    .set('Content-Type', 'application/json');
  httpOptions = {
    headers: this.headers
  };
  private apiUrl = `${environment.apiUrl}/ProductionOrder`;
  constructor(
    private http: HttpClient,
  ) { }


  async getproductionorders() {
    if (!(this.productionorderDataCache.length > 0)) {
      const data = await this.http.get<any[]>(this.apiUrl + "/ProdHeaders", this.httpOptions).toPromise();
      this.productionorderDataCache = data;
      return data;
    }
    else {
      return this.productionorderDataCache;
    }
  }
  getproductionorderdetails(id: number) {
    return this.http.get<any>(this.apiUrl + "/" + id, this.httpOptions).pipe(tap((res: any) => {
      return res;
    }));
  }
  async onRefreshproductionorder() {
    const data = await this.http.get<any[]>(this.apiUrl + "/ProdHeaders", this.httpOptions).toPromise();
    if (data == null) {
      this.productionorderDataCache = [];
    } else {
      this.productionorderDataCache = data;
    }
    return this.productionorderDataCache;
  }
  getPOprintlabels() {
    return this.http.get<any>(this.apiUrl + "/ProdPrintLines" , this.httpOptions).pipe(tap((res: any) => {
      return res;
    }));
  }
}
