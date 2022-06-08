import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PickListModel,CancelPicklist } from '../../shared/model/sales-order';

@Injectable({
  providedIn: 'root'
})
export class PicklistService {

  picklistDataCache: any[] = [];
  token = localStorage.getItem('access_token');
  selectedrowevent = new Subject<any>();
  refreshClickevent = new Subject<any>();
  headers = new HttpHeaders()
    .set('Authorization', "Bearer " + this.token)
    .set('Content-Type', 'application/json');;
  httpOptions = {
    headers: this.headers
  };
  private apiUrl = `${environment.apiUrl}/picklist/PickListHeader`;
  private picklistdetails = `${environment.apiUrl}/picklist/PicklistLines/`;
  private createpicklist = `${environment.apiUrl}/picklist/CreatePickList`;
  private picklistsummary = `${environment.apiUrl}/picklist/PicklistSummary/`;
  private cancelpicklist = `${environment.apiUrl}/picklist/CancelPickList`;

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }


  async getPicklist() {
    if (!(this.picklistDataCache.length > 0)) {
      const data = await this.http.get<any[]>(this.apiUrl, this.httpOptions).toPromise();
      this.picklistDataCache = data;
      return data;
    }
    else {
      return this.picklistDataCache;
    }
  }
  async onRefreshpicklist() {
    const data = await this.http.get<any[]>(this.apiUrl, this.httpOptions).toPromise();
    if (data == null) {
      this.picklistDataCache = [];
    } else {
      this.picklistDataCache = data;
    }
    return this.picklistDataCache;
  }
  getPicklistdetails(id: number) {
    return this.http.get<any>(this.picklistdetails + id, this.httpOptions).pipe(tap((res: any) => {
      return res;
    }));
  }
  getPicklistsummary(id: number) {
    return this.http.get<any>(this.picklistsummary + id, this.httpOptions).pipe(tap((res: any) => {
      return res;
    }));
  }
  createPicklist(picklistmodel: PickListModel) {
    return this.http.post<any>(this.createpicklist, picklistmodel, this.httpOptions).pipe(tap((res: any) => {
      return res;
    }));
  }
  CancelPicklist(data: CancelPicklist) {
    return this.http.post<any>(this.cancelpicklist, data, this.httpOptions).pipe(tap((res: any) => {
      return res;
    }));
  }

  
}
