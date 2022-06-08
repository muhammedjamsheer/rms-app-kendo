import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { WarrantyDetailsModel } from '../../shared/model/WarrantyDetailsModel';

@Injectable({
    providedIn: 'root'
})
export class WarrantyDetailsService {
    warrantyDetailsDataCache: WarrantyDetailsModel[] = [];
    token = localStorage.getItem('access_token');
    warrantyDetailsDataByKey!: WarrantyDetailsModel;
    selectedrowevent = new Subject<any>();
    refreshClickevent = new Subject<any>();
    headers = new HttpHeaders()
        .set('Authorization', "Bearer " + this.token);
    httpOptions = {
        headers: this.headers
    };

    constructor(private http: HttpClient,
        private router: Router) { }

    private warrantyDetailsUrl = `${environment.apiUrl}/warranty`;

    async getWarrantyDetails() {
        if (!(this.warrantyDetailsDataCache.length > 0)) {
            const data = await this.http.get<WarrantyDetailsModel[]>(this.warrantyDetailsUrl, this.httpOptions)
                .toPromise();
            this.warrantyDetailsDataCache = data;
            return data;
        }
        else {
            return this.warrantyDetailsDataCache;
        }
    }

    async onRefreshWarrantyDetails() {
        const data = await this.http.get<WarrantyDetailsModel[]>(this.warrantyDetailsUrl, this.httpOptions)
            .toPromise();
        this.warrantyDetailsDataCache = data;
        return this.warrantyDetailsDataCache;
    }

    addWarrantyDetails(formData: FormData) {
        // const formData = new FormData(); 
        // //let file: File = this.fileList[0];
        // //formData.append('uploadFile', file, file.name);
        // //this.warrantyDetailsModel.formfile = formData;
        // formData.append('serialNo','ASDSDF000002');
        // formData.append('warrantyStartDate','2021-06-01');
        // formData.append('warrantyEndDate','2021-06-30');
        // formData.append('warrantyCost','100');
        // formData.append('document','');
        return this.http.post<any>(`${environment.apiUrl}/Warranty`,
            formData
            , this.httpOptions)
            .pipe(tap((res: any) => {
                return res;
            }));
    }

    editWarrantyDetailsmaster(formData: FormData, warrantyId: number) {
        return this.http.put<any>(`${environment.apiUrl}/Warranty/` + warrantyId,
            formData, this.httpOptions)
            .pipe(tap((res: any) => {
                return res;
            }));
    }
    getWarrantyDetailsByKey(warrantyId: number) {
        const data = this.http.get<WarrantyDetailsModel>(this.warrantyDetailsUrl + '/' + warrantyId, this.httpOptions);
        return data;
        //return this.warrantyDetailsDataCache.find(item => item.warrantyId == warrantyId);
    }

    DeleteWarrantyDetails(warrantyId: number) {
        return this.http.delete<any>(`${environment.apiUrl}/Warranty/` + warrantyId, this.httpOptions)
            .pipe(tap((res: any) => {
                return res;
            }));
    }

    DeleteFromCache(warrantyId: number) {
        const objIndex = this.warrantyDetailsDataCache.findIndex(item => item.warrantyId == warrantyId);
        this.warrantyDetailsDataCache.splice(objIndex, 1);

    }

    AddOrEditRecordToCache(warrantyDetailsModel: WarrantyDetailsModel, editMode: boolean) {
        if (editMode) {
            const objIndex = this.warrantyDetailsDataCache.findIndex(item => item.warrantyId == warrantyDetailsModel.warrantyId);
            this.warrantyDetailsDataCache[objIndex] = warrantyDetailsModel;
        }
        else {
            this.warrantyDetailsDataCache.push(warrantyDetailsModel);
            this.warrantyDetailsDataCache.sort((a, b) => (a.serialNo > b.serialNo) ? 1 : -1);
        }
    }
}