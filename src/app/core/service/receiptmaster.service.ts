import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ReceiptMasterModel } from '../../shared/model//ReceiptMasterModel';

@Injectable({
    providedIn: 'root'
})
export class ReceiptMasterService {
    receiptMasterDataCache: ReceiptMasterModel[] = [];
    token = localStorage.getItem('access_token');
    receiptMasterDataByKey!: ReceiptMasterModel;
    selectedrowevent = new Subject<any>();
    refreshClickevent = new Subject<any>();
    headers = new HttpHeaders()
        .set('Authorization', "Bearer " + this.token);
    // .set('Content-Type', 'application/json');;
    fileheaders = new HttpHeaders()
        .set('Authorization', "Bearer " + this.token)
        .set('responseType', 'text');
    httpOptions = {
        headers: this.headers
    };
    filehttpOptions = {
        headers: this.fileheaders
    };

    constructor(private http: HttpClient,
        private router: Router) { }

    private receiptMasterUrl = `${environment.apiUrl}/Receipt`;
    private receiptsummaryurl = `${environment.apiUrl}/Receipt/receiptSummary/`

    async getReceiptMaster() {
        if (!(this.receiptMasterDataCache.length > 0)) {
            const data = await this.http.get<ReceiptMasterModel[]>(this.receiptMasterUrl, this.httpOptions)
                .toPromise();
            this.receiptMasterDataCache = (data == null ? [] : data);
            console.log(this.receiptMasterDataCache);
            return this.receiptMasterDataCache;
        }
        else {
            console.log(this.receiptMasterDataCache);
            return this.receiptMasterDataCache;
        }
    }

    UploadReceipt(formData: FormData) {
        return this.http.post<any>(`${environment.apiUrl}/Receipt/ReceiptUpload`,
            formData
            , this.filehttpOptions)
            .pipe(tap((res: any) => {
                return res;
            }));
    }

    async onRefreshReceiptMaster() {
        const data = await this.http.get<ReceiptMasterModel[]>(this.receiptMasterUrl, this.httpOptions).toPromise();
        if (data == null) {
            this.receiptMasterDataCache = [];
        } else {
            this.receiptMasterDataCache = data;
        }
        return this.receiptMasterDataCache;
    }

    addReceiptmaster(formData: FormData) {
        return this.http.post<any>(`${environment.apiUrl}/Receipt`,
            formData
            , this.httpOptions)
            .pipe(tap((res: any) => {
                return res;
            }));
    }

    editReceiptmaster(formData: FormData, receiptId: string) {
        return this.http.put<any>(`${environment.apiUrl}/Receipt/` + receiptId,
            formData, this.httpOptions)
            .pipe(tap((res: any) => {
                return res;
            }));
    }

    getReceiptMasterByKey(receiptId: string) {
        return this.getReceiptMaster().then((dataArray) => {
            return dataArray.find(item => item.receiptId == receiptId)
        });


        //return this.receiptMasterDataCache.find(item => item.receiptId == receiptId);
    }

    AddOrEditRecordToCache(receiptMasterModel: ReceiptMasterModel, editMode: boolean) {
        if (editMode) {
            const objIndex = this.receiptMasterDataCache.findIndex(item => item.receiptId == receiptMasterModel.receiptId);
            this.receiptMasterDataCache[objIndex] = receiptMasterModel;
        }
        else {
            if (this.receiptMasterDataCache == null)
                this.receiptMasterDataCache = [];
            this.receiptMasterDataCache.push(receiptMasterModel);
            this.receiptMasterDataCache.sort((a, b) => (a.receiptId > b.receiptId) ? 1 : -1);
        }
    }

    approveOrHoldReceipt(receiptId: string, remarks: string, status: number) {
        return this.http.put<any>(`${environment.apiUrl}/Receipt/` + receiptId + '/verify/' + status + '/' + remarks, null
            , this.httpOptions)
            .pipe(tap((res: any) => {
                //Update Local Cache
                //As the Operation is success, Update the local cache
                this.documentStatusChange(receiptId, status);
                return res;
            }));
    }

    documentStatusChange(receiptId: string, status: number) {
        const objIndex = this.receiptMasterDataCache.findIndex(item => item.receiptId == receiptId);
        if (objIndex > -1)
            this.receiptMasterDataCache[objIndex].receiptStatus = status;
    }
    getReceiptdetails(id: number) {
        return this.http.get<any>(this.receiptMasterUrl + "/" + id, this.httpOptions).pipe(tap((res: any) => {
            return res;
        }));
    }
    getReceiptsummary(id: number) {
        return this.http.get<any>(this.receiptsummaryurl + id, this.httpOptions).pipe(tap((res: any) => {
            return res;
        }));
    }
}