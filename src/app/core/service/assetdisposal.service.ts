import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AssetDisposalModel } from '../../shared/model/AssetDisposalModel';

@Injectable({
  providedIn: 'root'
})
export class AssetDisposalService {
    assetDisposalDataCache: AssetDisposalModel[] = [];
    token = localStorage.getItem('access_token');
    assetDisposalDataByKey!: AssetDisposalModel;
    selectedrowevent= new Subject<any>();
    refreshClickevent= new Subject<any>();
    headers = new HttpHeaders()
        .set('Authorization', "Bearer " + this.token)
        .set('Content-Type', 'application/json');;
    httpOptions = {
        headers: this.headers
    };

    constructor(private http: HttpClient,
        private router: Router) { }

    private assetDisposalUrl = `${environment.apiUrl}/AssetDisposal`;

    async getAssetDisposalMaster() {
        if (!(this.assetDisposalDataCache.length > 0)) {
            const data = await this.http.get<AssetDisposalModel[]>(this.assetDisposalUrl, this.httpOptions)
                .toPromise();
            this.assetDisposalDataCache = data;
            return data;
        }
        else {
            return this.assetDisposalDataCache;
        }
    }

    async onRefreshAssetDisposalMaster() {
        const data = await this.http.get<AssetDisposalModel[]>(this.assetDisposalUrl, this.httpOptions)
            .toPromise();
        this.assetDisposalDataCache = data;
        return this.assetDisposalDataCache;
    }

    addAssetDisposalmaster(AssetDisposalModel: AssetDisposalModel) {
        return this.http.post<any>(`${environment.apiUrl}/AssetDisposal`,
            AssetDisposalModel
            , this.httpOptions)
            .pipe(tap((res: any) => {
                return res;
            }));
    }

    editAssetDisposalmaster(assetDisposalModel: AssetDisposalModel) {
        return this.http.put<any>(`${environment.apiUrl}/AssetDisposal/` + assetDisposalModel.disposalId,
        assetDisposalModel, this.httpOptions)
            .pipe(tap((res: any) => {
                return res;
            }));
    }
    getAssetDisposalMasterByKey(disposalId: number) {
        return this.assetDisposalDataCache.find(item => item.disposalId == disposalId);
    }

    AddOrEditRecordToCache(assetDisposalModel: AssetDisposalModel, editMode: boolean){
        if(editMode)
        {
          const objIndex = this.assetDisposalDataCache.findIndex(item => item.disposalId == assetDisposalModel.disposalId);
          this.assetDisposalDataCache[objIndex] = assetDisposalModel;
        }
        else
        {
          this.assetDisposalDataCache.push(assetDisposalModel);
          this.assetDisposalDataCache.sort((a, b) => (a.disposalId > b.disposalId) ? 1 : -1);
        }
      }
      
}