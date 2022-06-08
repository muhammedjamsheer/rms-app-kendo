import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { AdditionalCostDetailsModel } from '../../shared/model/AdditionalCostDetailsModel';

@Injectable({
    providedIn: 'root'
})
export class AdditionalCostDetailsService {
    additionalCostDetailsDataCache: AdditionalCostDetailsModel[] = [];
    token = localStorage.getItem('access_token');
    additionalCostDetailsDataByKey!: AdditionalCostDetailsModel;
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

    private additionalCostDetailsUrl = `${environment.apiUrl}/AssetAddition`;

    async getAdditionalCostDetails() {
        if (!(this.additionalCostDetailsDataCache.length > 0)) {
            const data = await this.http.get<AdditionalCostDetailsModel[]>(this.additionalCostDetailsUrl, this.httpOptions)
                .toPromise();
            this.additionalCostDetailsDataCache = data;
            return data;
        }
        else {
            return this.additionalCostDetailsDataCache;
        }
    }

    async onRefreshAdditionalCostDetails() {
        const data = await this.http.get<AdditionalCostDetailsModel[]>(this.additionalCostDetailsUrl, this.httpOptions)
            .toPromise();
        this.additionalCostDetailsDataCache = data;
        return this.additionalCostDetailsDataCache;
    }

    addAdditionalCostDetails(additionalCostDetailsModel: AdditionalCostDetailsModel) {
        return this.http.post<any>(`${environment.apiUrl}/AssetAddition`,
            additionalCostDetailsModel
            , this.httpOptions)
            .pipe(tap((res: any) => {
                return res;
            }));
    }

    editAdditionalCostDetailsmaster(additionalCostDetailsModel: AdditionalCostDetailsModel) {
        return this.http.put<any>(`${environment.apiUrl}/AssetAddition/` + additionalCostDetailsModel.assetAdditionId,
            additionalCostDetailsModel, this.httpOptions)
            .pipe(tap((res: any) => {
                return res;
            }));
    }
    getAdditionalCostDetailsByKey(additionalCostId: number) {
        return this.additionalCostDetailsDataCache.find(item => item.assetAdditionId == additionalCostId);
    }

    DeleteAdditionalCostDetails(assetAdditionId: number) {
        return this.http.delete<any>(`${environment.apiUrl}/AssetAddition/` + assetAdditionId, this.httpOptions)
            .pipe(tap((res: any) => {
                return res;
            }));
    }

    DeleteFromCache(additionalCostId: number) {
        const objIndex = this.additionalCostDetailsDataCache.findIndex(item => item.assetAdditionId == additionalCostId);
        this.additionalCostDetailsDataCache.splice(objIndex, 1);

    }

    AddOrEditRecordToCache(additionalCostDetailsModel: AdditionalCostDetailsModel, editMode: boolean) {
        if (editMode) {
            const objIndex = this.additionalCostDetailsDataCache.findIndex(item => item.assetAdditionId == additionalCostDetailsModel.assetAdditionId);
            this.additionalCostDetailsDataCache[objIndex] = additionalCostDetailsModel;
        }
        else {
            this.additionalCostDetailsDataCache.push(additionalCostDetailsModel);
            this.additionalCostDetailsDataCache.sort((a, b) => (a.serialNo > b.serialNo) ? 1 : -1);
        }
    }
}