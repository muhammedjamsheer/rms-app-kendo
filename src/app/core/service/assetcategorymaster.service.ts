import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Subject } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { AssetCategoryMasterModel } from '../../shared/model/AssetCategoryMasterModel';

@Injectable({ providedIn: 'root' })
export class AssetCategoryMasterService {
  assetCategoryMasterDataCache: AssetCategoryMasterModel[] = [];
  assetCategoryMasterDataByKey!: AssetCategoryMasterModel;
  selectedrowevent = new Subject<any>();
  refreshClickevent = new Subject<any>();

  constructor(private http: HttpClient) { }

  private assetCategoryMasterUrl = `${environment.apiUrl}/AssetCategory`;

  async getAssetCategoryMaster() {
    if (!(this.assetCategoryMasterDataCache.length > 0)) {

      //SA: Mapping to expected format
      const data = await this.http.get<AssetCategoryMasterModel[]>(this.assetCategoryMasterUrl).
        pipe(map(categories => categories.map(category => {
          let mapped = new AssetCategoryMasterModel();
          mapped.assetCategoryId = category.assetCategoryId,
            mapped.assetCategoryCode = category.assetCategoryCode,
            mapped.assetCategoryName = category.assetCategoryName,
            mapped.assetCategoryShortCode = category.assetCategoryShortCode,
            mapped.categoryDepreciationPeriod = category.categoryDepreciationPeriod,
            mapped.categoryDepreciationPercent = category.categoryDepreciationPercent,
            mapped.isDeleted = category.isDeleted
          return mapped;
        }
        ))).toPromise();


      this.assetCategoryMasterDataCache = data;
      return data;
    }
    else {
      return this.assetCategoryMasterDataCache;
    }
  }

  async onRefreshAssetCategoryMaster() {
    const data = await this.http.get<AssetCategoryMasterModel[]>(this.assetCategoryMasterUrl).toPromise();
    if (data == null) {
      this.assetCategoryMasterDataCache = [];
    } else {
      this.assetCategoryMasterDataCache = data;
    }
    return this.assetCategoryMasterDataCache;
  }

  addAssetCategorymaster(assetCategoryMastermodel: AssetCategoryMasterModel) {
    return this.http.post<any>(`${environment.apiUrl}/AssetCategory`, assetCategoryMastermodel)
      .pipe(tap(
        (res: any) => {
          assetCategoryMastermodel.assetCategoryId = res.assetCategoryId;
          this.AddOrEditRecordToCache(assetCategoryMastermodel, false);
          return res;
        },
        (err: any) => {
          console.error(err);
          return err;
        }
      ));
  }

  editAssetCategorymaster(assetCategoryMastermodel: AssetCategoryMasterModel) {
    return this.http.put<any>(`${environment.apiUrl}/AssetCategory/` + assetCategoryMastermodel.assetCategoryId,
      assetCategoryMastermodel)
      .pipe(tap(
        (res: any) => {
          this.AddOrEditRecordToCache(assetCategoryMastermodel, true);
          return res;
        },
        (err: any) => {
          console.error(err);
          return err;
        }
      ));
  }

  getAssetCategoryMasterByKey(assetCategoryID: number) {
    return this.assetCategoryMasterDataCache.find(item => item.assetCategoryId == assetCategoryID);
  }

  AddOrEditRecordToCache(assetCategoryMastermodel: AssetCategoryMasterModel, editMode: boolean) {
    if (editMode) {
      const objIndex = this.assetCategoryMasterDataCache.findIndex(item => item.assetCategoryId == assetCategoryMastermodel.assetCategoryId);
      this.assetCategoryMasterDataCache[objIndex] = assetCategoryMastermodel;
    }
    else {
      this.assetCategoryMasterDataCache.push(assetCategoryMastermodel);
      this.assetCategoryMasterDataCache.sort((a, b) => (a.assetCategoryCode > b.assetCategoryCode) ? 1 : -1);
    }
  }

  DeleteAssetCategoryMaster(assetCategoryID: number) {
    return this.http.delete<any>(`${environment.apiUrl}/AssetCategory/` + assetCategoryID)
      .pipe(tap((res: any) => {
        return res;
      }));
  }

  DeleteFromCache(assetCategoryID: number) {
    const objIndex = this.assetCategoryMasterDataCache.findIndex(item => item.assetCategoryId == assetCategoryID);
    this.assetCategoryMasterDataCache.splice(objIndex, 1);
  }
}
