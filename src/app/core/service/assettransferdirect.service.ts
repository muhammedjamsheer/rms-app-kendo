import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AssetTransferDirectModel, AssetTransferVerifyModel } from '../../shared/model/AssetTransferDirectModel';

@Injectable({
    providedIn: 'root'
})
export class AssetTransferDirectService {
    assetTransferDirectDataCache: AssetTransferDirectModel[] = [];
    token = localStorage.getItem('access_token');
    assetTransferDirectDataByKey!: AssetTransferDirectModel;
    selectedrowevent = new Subject<any>();
    refreshClickevent = new Subject<any>();
    headers = new HttpHeaders()
        .set('Authorization', "Bearer " + this.token);
    httpOptions = {
        headers: this.headers
    };

    constructor(private http: HttpClient,
        private router: Router) { }

    private assetTransferDirectUrl = `${environment.apiUrl}/Transfer`;

    async getAssetTransferDirect() {
        if (!(this.assetTransferDirectDataCache.length > 0)) {
            const data = await this.http.get<AssetTransferDirectModel[]>(this.assetTransferDirectUrl, this.httpOptions)
                .toPromise();
            this.assetTransferDirectDataCache = (data == null ? [] : data);
            return this.assetTransferDirectDataCache;
        }
        else {
            return this.assetTransferDirectDataCache;
        }
    }

    async onRefreshAssetTransferDirect() {
        const data = await this.http.get<AssetTransferDirectModel[]>(this.assetTransferDirectUrl, this.httpOptions).toPromise();
        if (data == null) {
            this.assetTransferDirectDataCache = [];
        } else {
            this.assetTransferDirectDataCache = data;
        }
        return this.assetTransferDirectDataCache;
    }

    addAssetTransferDirect(formData: FormData) {
        return this.http.post<any>(`${environment.apiUrl}/Transfer`,
            formData
            , this.httpOptions)
            .pipe(tap((res: any) => {
                return res;
            }));
    }

    editAssetTransferDirectmaster(formData: FormData, transferNo: string) {
        return this.http.put<any>(`${environment.apiUrl}/Transfer/` + transferNo,
            formData, this.httpOptions)
            .pipe(tap((res: any) => {
                return res;
            }));
    }

    ApproveRequest(formData: AssetTransferVerifyModel) {
        return this.http.post<any>(`${environment.apiUrl}/Transfer/verify`,
            formData
            , this.httpOptions)
            .pipe(tap((res: any) => {
                return res;
            }));
    }

    getAssetTransferDirectByKey(transferNo: string) {
        const data = this.http.get<AssetTransferDirectModel>(this.assetTransferDirectUrl + '/' + transferNo, this.httpOptions);
        return data;
        //return this.assetTransferDirectDataCache.find(item => item.transferNo == transferNo);
    }

    DeleteAssetTransferDirect(transferNo: string) {
        return this.http.delete<any>(`${environment.apiUrl}/Transfer/` + transferNo, this.httpOptions)
            .pipe(tap((res: any) => {
                return res;
            }));
    }

    DeleteFromCache(transferNo: string) {
        const objIndex = this.assetTransferDirectDataCache.findIndex(item => item.transferNo == transferNo);
        this.assetTransferDirectDataCache.splice(objIndex, 1);

    }

    AddOrEditRecordToCache(assetTransferDirectModel: AssetTransferDirectModel, editMode: boolean) {
        if (editMode) {
            const objIndex = this.assetTransferDirectDataCache.findIndex(item => item.transferNo == assetTransferDirectModel.transferNo);
            this.assetTransferDirectDataCache[objIndex] = assetTransferDirectModel;
        }
        else {
            this.assetTransferDirectDataCache.push(assetTransferDirectModel);
            this.assetTransferDirectDataCache.sort((a, b) => (a.transferNo > b.transferNo) ? 1 : -1);
        }
    }
}