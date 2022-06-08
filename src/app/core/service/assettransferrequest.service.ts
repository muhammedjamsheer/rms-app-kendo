import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AssetTransferDirectModel } from 'src/app/shared/model/AssetTransferDirectModel';
import { environment } from '../../../environments/environment';
import { AssetTransferRequestModel } from '../../shared/model/AssetTransferRequestModel';

@Injectable({
    providedIn: 'root'
})
export class AssetTransferRequestService {
    assetTransferRequestDataCache: AssetTransferRequestModel[] = [];
    token = localStorage.getItem('access_token');
    assetTransferDirectDataByKey!: AssetTransferRequestModel;
    selectedrowevent = new Subject<any>();
    refreshClickevent = new Subject<any>();
    headers = new HttpHeaders()
        .set('Authorization', "Bearer " + this.token);
    httpOptions = {
        headers: this.headers
    };

    constructor(private http: HttpClient,
        private router: Router) { }

    private assetTransferDirectUrl = `${environment.apiUrl}/TransferRequest`;

    async getAssetTransferRequest() {
        if (!(this.assetTransferRequestDataCache.length > 0)) {
            const data = await this.http.get<AssetTransferRequestModel[]>(this.assetTransferDirectUrl, this.httpOptions)
                .toPromise();
            this.assetTransferRequestDataCache = data;
            return data;
        }
        else {
            return this.assetTransferRequestDataCache;
        }
    }

    async onRefreshAssetTransferRequest() {
        const data = await this.http.get<AssetTransferRequestModel[]>(this.assetTransferDirectUrl, this.httpOptions).toPromise();
        if (data == null) {
            this.assetTransferRequestDataCache = [];
        } else {
            this.assetTransferRequestDataCache = data;
        }
        return this.assetTransferRequestDataCache;
    }

    CloseTransferRequest(requestNo: string) {
        return this.http.put<any>(`${environment.apiUrl}/TransferRequest/` + requestNo + '/CloseTransfer',
            null, this.httpOptions)
            .pipe(tap((res: any) => {
                return res;
            }));
    }

    addAssetTransferRequest(assetTransferRequestModel: any) {
        // const formData = new FormData(); 
        // //let file: File = this.fileList[0];
        // //formData.append('uploadFile', file, file.name);
        // //this.assetTransferDirectModel.formfile = formData;
        // formData.append('requestNo','ASDSDF000002');
        // formData.append('warrantyStartDate','2021-06-01');
        // formData.append('warrantyEndDate','2021-06-30');
        // formData.append('warrantyCost','100');
        // formData.append('document','');
        return this.http.post<any>(`${environment.apiUrl}/TransferRequest`,
            assetTransferRequestModel
            , this.httpOptions)
            .pipe(tap((res: any) => {
                return res;
            }));
    }

    editAssetTransferRequestmaster(assetTransferRequestModel: any) {
        return this.http.put<any>(`${environment.apiUrl}/TransferRequest/` + assetTransferRequestModel.requestNo,
            assetTransferRequestModel, this.httpOptions)
            .pipe(tap((res: any) => {
                return res;
            }));
    }

    ApproveRequest(requestNo: string, remarks: string, status: number) {
        return this.http.put<any>(`${environment.apiUrl}/TransferRequest/` + requestNo + '/verify/' + status + '/' + remarks,
            null, this.httpOptions)
            .pipe(tap((res: any) => {
                return res;
            }));
    }

    getAssetTransferRequestByKey(requestNo: string) {
        const data = this.http.get<AssetTransferRequestModel>(this.assetTransferDirectUrl + '/' + requestNo, this.httpOptions);
        return data;
        //return this.assetTransferRequestDataCache.find(item => item.requestNo == requestNo);
    }

    getAssetTransferViewRequestByKey(requestNo: string) {
        const data = this.http.get<AssetTransferDirectModel>(`${environment.apiUrl}/Transfer/request/` + requestNo, this.httpOptions);
        return data;
        //return this.assetTransferRequestDataCache.find(item => item.requestNo == requestNo);
    }

    DeleteAssetTransferRequest(requestNo: string) {
        return this.http.delete<any>(`${environment.apiUrl}/TransferRequest/` + requestNo, this.httpOptions)
            .pipe(tap((res: any) => {
                return res;
            }));
    }

    DeleteFromCache(requestNo: string) {
        const objIndex = this.assetTransferRequestDataCache.findIndex(item => item.requestNo == requestNo);
        this.assetTransferRequestDataCache.splice(objIndex, 1);

    }

    AddOrEditRecordToCache(assetTransferDirectModel: AssetTransferRequestModel, editMode: boolean) {
        if (editMode) {
            const objIndex = this.assetTransferRequestDataCache.findIndex(item => item.requestNo == assetTransferDirectModel.requestNo);
            this.assetTransferRequestDataCache[objIndex] = assetTransferDirectModel;
        }
        else {
            this.assetTransferRequestDataCache.push(assetTransferDirectModel);
            this.assetTransferRequestDataCache.sort((a, b) => (a.requestNo > b.requestNo) ? 1 : -1);
        }
    }
}