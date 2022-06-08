import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AssetMaintenanceModel } from '../../shared/model/AssetMaintenanceModel';

@Injectable({
    providedIn: 'root'
})
export class AssetMaintenanceService {
    assetMaintenanceDataCache: AssetMaintenanceModel[] = [];
    token = localStorage.getItem('access_token');
    assetMaintenanceDataByKey!: AssetMaintenanceModel;
    selectedrowevent = new Subject<any>();
    refreshClickevent = new Subject<any>();
    headers = new HttpHeaders()
        .set('Authorization', "Bearer " + this.token)
        .set('Content-Type', 'application/json');
    httpOptions = {
        headers: this.headers
    };

    constructor(private http: HttpClient,
        private router: Router) { }

    private assetMaintenanceUrl = `${environment.apiUrl}/Maintenance`;

    async getAssetMaintenance() {
        if (!(this.assetMaintenanceDataCache.length > 0)) {
            const data = await this.http.get<AssetMaintenanceModel[]>(this.assetMaintenanceUrl, this.httpOptions)
                .toPromise();
            this.assetMaintenanceDataCache = data;
            return data;
        }
        else {
            return this.assetMaintenanceDataCache;
        }
    }

    async onRefreshAssetMaintenance() {
        const data = await this.http.get<AssetMaintenanceModel[]>(this.assetMaintenanceUrl, this.httpOptions).toPromise();
        if (data == null) {
            this.assetMaintenanceDataCache = [];
        } else {
            this.assetMaintenanceDataCache = data;
        }
        return this.assetMaintenanceDataCache;
    }

    addAssetMaintenance(assetMaintenanceModel: AssetMaintenanceModel) {
        return this.http.post<any>(`${environment.apiUrl}/Maintenance`,
            assetMaintenanceModel
            , this.httpOptions)
            .pipe(tap((res: any) => {
                return res;
            }));
    }

    editAssetMaintenancemaster(assetMaintenanceModel: AssetMaintenanceModel) {
        return this.http.put<any>(`${environment.apiUrl}/Maintenance/` + assetMaintenanceModel.maintenanceId,
            assetMaintenanceModel, this.httpOptions)
            .pipe(tap((res: any) => {
                return res;
            }));
    }
    getAssetMaintenanceByKey(maintenanceId: number) {
        const data = this.http.get<AssetMaintenanceModel>(this.assetMaintenanceUrl + '/' + maintenanceId, this.httpOptions);
        return data;
    }

    DeleteAssetMaintenance(maintenanceId: number) {
        return this.http.delete<any>(`${environment.apiUrl}/Maintenance/` + maintenanceId, this.httpOptions)
            .pipe(tap((res: any) => {
                return res;
            }));
    }

    DeleteFromCache(additionalCostId: number) {
        const objIndex = this.assetMaintenanceDataCache.findIndex(item => item.maintenanceId == additionalCostId);
        this.assetMaintenanceDataCache.splice(objIndex, 1);

    }

    AddOrEditRecordToCache(assetMaintenanceModel: AssetMaintenanceModel, editMode: boolean) {
        if (editMode) {
            const objIndex = this.assetMaintenanceDataCache.findIndex(item => item.maintenanceId == assetMaintenanceModel.maintenanceId);
            this.assetMaintenanceDataCache[objIndex] = assetMaintenanceModel;
        }
        else {
            this.assetMaintenanceDataCache.push(assetMaintenanceModel);
            this.assetMaintenanceDataCache.sort((a, b) => (a.serialNo > b.serialNo) ? 1 : -1);
        }
    }
}