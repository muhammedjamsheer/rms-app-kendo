import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { UserMasterModel } from 'src/app/shared/model/UserMasterModel';


@Injectable({
  providedIn: 'root'
})
export class WarehousemasterService {
  warehouseMasterDataCache: UserMasterModel[] = [];
  token = localStorage.getItem('access_token');
  userDataByKey!: UserMasterModel;
  selectedrowevent = new Subject<any>();
  refreshClickevent = new Subject<any>();

  constructor(private http: HttpClient) {}

  private userMasterUrl = `${environment.apiUrl}/warehousemaster/warehouse`;

  async getWarehouseMaster() {
    if (!(this.warehouseMasterDataCache.length > 0)) {
      const data = await this.http.get<UserMasterModel[]>(this.userMasterUrl)
        .toPromise();
      this.warehouseMasterDataCache = data;
      return data;
    }
    else {
      return this.warehouseMasterDataCache;
    }
  }
}
