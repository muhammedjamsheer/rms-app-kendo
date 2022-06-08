import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { BrandMasterModel } from '../../shared/model/BrandMasterModel';

@Injectable({
  providedIn: 'root'
})
export class BrandmasterService {
  brandmasterDataCache: BrandMasterModel[] = [];
  token = localStorage.getItem('access_token');
  brandMasterDataByKey!: BrandMasterModel;
  selectedrowevent = new Subject<any>();
  refreshClickevent = new Subject<any>();
  headers = new HttpHeaders()
    .set('Authorization', "Bearer " + this.token)
    .set('Content-Type', 'application/json');;
  httpOptions = {
    headers: this.headers
  };

  constructor(private http: HttpClient,
    private router: Router) { }

  private brandMasterUrl = `${environment.apiUrl}/Brand`;

  async getBrandMaster() {
    if (!(this.brandmasterDataCache.length > 0)) {
      const data = await this.http.get<BrandMasterModel[]>(this.brandMasterUrl, this.httpOptions)
        .toPromise();
      this.brandmasterDataCache = data;
      return data;
    }
    else {
      return this.brandmasterDataCache;
    }
  }

  async onRefreshBrandmaster() {
    const data = await this.http.get<BrandMasterModel[]>(this.brandMasterUrl, this.httpOptions)
      .toPromise();
    this.brandmasterDataCache = data;
    return data;
  }

  addBrandmaster(brandmastermodel: BrandMasterModel) {
    return this.http.post<any>(`${environment.apiUrl}/Brand`,
      brandmastermodel
      , this.httpOptions)
      .pipe(tap((res: any) => {
        return res;
      }));
  }

  editBrandmaster(brandmastermodel: BrandMasterModel) {
    return this.http.put<any>(`${environment.apiUrl}/Brand/` + brandmastermodel.brandID,
      brandmastermodel, this.httpOptions)
      .pipe(tap((res: any) => {
        return res;
      }));
  }
  getBrandMasterByKey(brandID: number) {
    return this.brandmasterDataCache.find(item => item.brandID == brandID);
  }

  AddOrEditRecordToCache(brandmastermodel: BrandMasterModel, editMode: boolean) {
    if (editMode) {
      const objIndex = this.brandmasterDataCache.findIndex(item => item.brandID == brandmastermodel.brandID);
      this.brandmasterDataCache[objIndex] = brandmastermodel;
    }
    else {
      this.brandmasterDataCache.push(brandmastermodel);
      this.brandmasterDataCache.sort((a, b) => (a.brandCode > b.brandCode) ? 1 : -1);
    }
  }

  DeleteBrandMaster(brandID: number) {
    return this.http.delete<any>(`${environment.apiUrl}/Brand/` + brandID, this.httpOptions)
      .pipe(tap((res: any) => {
        return res;
      }));
  }

  DeleteFromCache(brandID: number) {
    const objIndex = this.brandmasterDataCache.findIndex(item => item.brandID == brandID);
    this.brandmasterDataCache.splice(objIndex, 1);

  }
}
