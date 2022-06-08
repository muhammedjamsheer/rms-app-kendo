import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { SiteMasterModel } from '../../shared/model/sitemastermodel';

@Injectable({ providedIn: 'root' })
export class SitemasterService {

  private siteMasterUrl = `${environment.apiUrl}/Site`;

  sitemasterDataCache: SiteMasterModel[] = [];
  siteMasterDataByKey!: SiteMasterModel;
  selectedrowevent = new Subject<any>();
  refreshClickevent = new Subject<any>();

  constructor(private http: HttpClient) {

  }

  async getSiteMaster() {
    if (!(this.sitemasterDataCache.length > 0)) {
      const data = await this.http.get<SiteMasterModel[]>(this.siteMasterUrl).toPromise();
      this.sitemasterDataCache = data;
      return data;
    }
    else {
      return this.sitemasterDataCache;
    }
  }

  async onRefreshSitemaster() {
    const data = await this.http.get<SiteMasterModel[]>(this.siteMasterUrl).toPromise();
    if (data == null) {
      this.sitemasterDataCache = [];
    } else {
      this.sitemasterDataCache = data;
    }
    return this.sitemasterDataCache;
  }

  addSitemaster(sitemastermodel: SiteMasterModel) {
    return this.http.post<any>(`${environment.apiUrl}/Site`, sitemastermodel)
      .pipe(tap((res: any) => {
        return res;
      }));
  }

  editSitemaster(sitemastermodel: SiteMasterModel) {
    return this.http.put<any>(`${environment.apiUrl}/Site/` + sitemastermodel.siteID, sitemastermodel)
      .pipe(tap((res: any) => {
        return res;
      }));
  }
  getSiteMasterByKey(siteID: number) {
    return this.sitemasterDataCache.find(item => item.siteID == siteID);
  }

  AddOrEditRecordToCache(siteMasterModel: SiteMasterModel, editMode: boolean) {
    if (editMode) {
      const objIndex = this.sitemasterDataCache.findIndex(item => item.siteID == siteMasterModel.siteID);
      this.sitemasterDataCache[objIndex] = siteMasterModel;
    }
    else {
      this.sitemasterDataCache.push(siteMasterModel);
      this.sitemasterDataCache.sort((a, b) => (a.siteCode > b.siteCode) ? 1 : -1);
    }
  }

  DeleteSiteMaster(siteID: number) {
    return this.http.delete<any>(`${environment.apiUrl}/Site/` + siteID)
      .pipe(tap((res: any) => {
        return res;
      }));
  }

  DeleteFromCache(siteID: number) {
    const objIndex = this.sitemasterDataCache.findIndex(item => item.siteID == siteID);
    this.sitemasterDataCache.splice(objIndex, 1);

  }
}
