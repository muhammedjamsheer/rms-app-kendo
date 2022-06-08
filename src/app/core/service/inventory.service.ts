import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  inventorySummaryDataCache: any[] = [];
  inventoryDetailsDataCache: any[] = [];
  token = localStorage.getItem('access_token');
  selectedrowevent = new Subject<any>();
  refreshClickevent = new Subject<any>();
  headers = new HttpHeaders()
    .set('Authorization', "Bearer " + this.token)
    .set('Content-Type', 'application/json');;
  httpOptions = {
    headers: this.headers
  };
  private detailsapiUrl = `${environment.apiUrl}/Receipt/Inventory`;
  private summaryapiUrl = `${environment.apiUrl}/Receipt/InventorySummary`;
  constructor(
    private http: HttpClient,
  ) { }


  async getInventorySummary() {
    if (!(this.inventorySummaryDataCache.length > 0)) {
      const data = await this.http.get<any[]>(this.summaryapiUrl, this.httpOptions).toPromise();
      this.inventorySummaryDataCache = data;
      return data;
    }
    else {
      return this.inventorySummaryDataCache;
    }
  }
  async onRefreshinventorysummary() {
    const data = await this.http.get<any[]>(this.summaryapiUrl, this.httpOptions).toPromise();
    if (data == null) {
      this.inventorySummaryDataCache = [];
    } else {
      this.inventorySummaryDataCache = data;
    }
    return this.inventorySummaryDataCache;
  }


  async getInventoryDetails() {
    if (!(this.inventoryDetailsDataCache.length > 0)) {
      const data = await this.http.get<any[]>(this.detailsapiUrl, this.httpOptions).toPromise();
      this.inventoryDetailsDataCache = data;
      return data;
    }
    else {
      return this.inventoryDetailsDataCache;
    }
  }
  async onRefreshinventoryDetails() {
    const data = await this.http.get<any[]>(this.detailsapiUrl, this.httpOptions).toPromise();
    if (data == null) {
      this.inventoryDetailsDataCache = [];
    } else {
      this.inventoryDetailsDataCache = data;
    }
    return this.inventoryDetailsDataCache;
  }

}
