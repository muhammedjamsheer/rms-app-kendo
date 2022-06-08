import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AssetSubCategoryMasterModel } from '../../shared/model/AssetSubCategoryMasterModel';

@Injectable({
  providedIn: 'root'
})
export class AssetSubCategoryMasterService {
  assetSubCategoryMasterDataCache: AssetSubCategoryMasterModel[] = [];
  token = localStorage.getItem('access_token');
  assetSubCategoryMasterDataByKey!: AssetSubCategoryMasterModel;
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

  private assetSubCategoryMasterUrl = `${environment.apiUrl}/AssetSubCategory`;

  async getAssetSubCategoryMaster() {
    if (!(this.assetSubCategoryMasterDataCache.length > 0)) {
      const data = await this.http.get<AssetSubCategoryMasterModel[]>(this.assetSubCategoryMasterUrl, this.httpOptions)
        .toPromise();
      this.assetSubCategoryMasterDataCache = data;
      return data;
    }
    else {
      return this.assetSubCategoryMasterDataCache;
    }
  }

  async onRefreshAssetSubCategoryMaster() {
    const data = await this.http.get<AssetSubCategoryMasterModel[]>(this.assetSubCategoryMasterUrl, this.httpOptions)
      .toPromise();
    this.assetSubCategoryMasterDataCache = data;
    return data;
  }

  addAssetSubCategorymaster(assetSubCategoryMasterModel: AssetSubCategoryMasterModel) {
    return this.http.post<any>(`${environment.apiUrl}/AssetSubCategory`,
      assetSubCategoryMasterModel
      , this.httpOptions)
      .pipe(tap((res: any) => {
        return res;
      }));
  }

  editAssetSubCategorymaster(assetSubCategoryMasterModel: AssetSubCategoryMasterModel) {
    return this.http.put<any>(`${environment.apiUrl}/AssetSubCategory/` + assetSubCategoryMasterModel.assetSubCategoryId,
      assetSubCategoryMasterModel, this.httpOptions)
      .pipe(tap((res: any) => {
        return res;
      }));
  }
  getAssetSubCategoryMasterByKey(assetSubCategoryID: number) {
    return this.assetSubCategoryMasterDataCache.find(item => item.assetSubCategoryId == assetSubCategoryID);
  }

  AddOrEditRecordToCache(assetSubCategoryMasterModel: AssetSubCategoryMasterModel, editMode: boolean) {
    if (editMode) {
      const objIndex = this.assetSubCategoryMasterDataCache.findIndex(item => item.assetSubCategoryId == assetSubCategoryMasterModel.assetSubCategoryId);
      this.assetSubCategoryMasterDataCache[objIndex] = assetSubCategoryMasterModel;
    }
    else {
      this.assetSubCategoryMasterDataCache.push(assetSubCategoryMasterModel);
      this.assetSubCategoryMasterDataCache.sort((a, b) => (a.assetSubCategoryCode > b.assetSubCategoryCode) ? 1 : -1);
    }
  }

  DeleteAssetSubCategoryMaster(assetSubCategoryID: number) {
    return this.http.delete<any>(`${environment.apiUrl}/AssetSubCategory/` + assetSubCategoryID, this.httpOptions)
      .pipe(tap((res: any) => {
        return res;
      }));
  }

  DeleteFromCache(assetSubCategoryID: number) {
    const objIndex = this.assetSubCategoryMasterDataCache.findIndex(item => item.assetSubCategoryId == assetSubCategoryID);
    this.assetSubCategoryMasterDataCache.splice(objIndex, 1);

  }
}
