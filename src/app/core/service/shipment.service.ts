import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class ShipmentService {
  shipmentDataCache: any[] = [];
  token = localStorage.getItem('access_token');
  selectedrowevent = new Subject<any>();
  refreshClickevent = new Subject<any>();
  headers = new HttpHeaders()
    .set('Authorization', "Bearer " + this.token)
    .set('Content-Type', 'application/json');;
  httpOptions = {
    headers: this.headers
  };
  private apiUrl = `${environment.apiUrl}/am/shipment`;
  private shipmentsummaryapiUrl = `${environment.apiUrl}/am/shipment/shipmentSummary/`;
  private shipmentlistapiUrl = `${environment.apiUrl}/Shipment/mobileOpenTo`;

  constructor(
    private http: HttpClient,
  ) { }


  async getshipment() {
    if (!(this.shipmentDataCache.length > 0)) {
      const data = await this.http.get<any[]>(this.apiUrl, this.httpOptions).toPromise();
      this.shipmentDataCache = data;
      return data;
    }
    else {
      return this.shipmentDataCache;
    }
  }
  async onRefreshshipment() {
    const data = await this.http.get<any[]>(this.apiUrl, this.httpOptions).toPromise();
    if (data == null) {
      this.shipmentDataCache = [];
    } else {
      this.shipmentDataCache = data;
    }
    return this.shipmentDataCache;
  }
  getshipmentdetails(id: number) {
    return this.http.get<any>(this.apiUrl + "/" + id, this.httpOptions).pipe(tap((res: any) => {
      return res;
    }));
  }
  getshipmentsummary(id: number) {
    return this.http.get<any>(this.shipmentsummaryapiUrl + id, this.httpOptions).pipe(tap((res: any) => {
      return res;
    }));
  }
  async getShipmentList() {
    const data = await this.http.get<any[]>(this.shipmentlistapiUrl, this.httpOptions).toPromise();
    return data;
  }
}
