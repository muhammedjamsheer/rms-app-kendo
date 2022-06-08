import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { InsuranceDetailsModel } from '../../shared/model/InsuranceDetailsModel';

@Injectable({
    providedIn: 'root'
})
export class InsuranceDetailsService {
    insuranceDetailsDataCache: InsuranceDetailsModel[] = [];
    token = localStorage.getItem('access_token');
    insuranceDetailsDataByKey!: InsuranceDetailsModel;
    selectedrowevent = new Subject<any>();
    refreshClickevent = new Subject<any>();
    headers = new HttpHeaders()
        .set('Authorization', "Bearer " + this.token);
    httpOptions = {
        headers: this.headers
    };

    constructor(private http: HttpClient,
        private router: Router) { }

    private insuranceDetailsUrl = `${environment.apiUrl}/insurance`;

    async getInsuranceDetails() {
        if (!(this.insuranceDetailsDataCache.length > 0)) {
            const data = await this.http.get<InsuranceDetailsModel[]>(this.insuranceDetailsUrl, this.httpOptions)
                .toPromise();
            this.insuranceDetailsDataCache = data;
            return data;
        }
        else {
            return this.insuranceDetailsDataCache;
        }
    }

    async onRefreshInsuranceDetails() {
        const data = await this.http.get<InsuranceDetailsModel[]>(this.insuranceDetailsUrl, this.httpOptions)
            .toPromise();
        this.insuranceDetailsDataCache = data;
        return this.insuranceDetailsDataCache;
    }

    addInsuranceDetails(formData: FormData) {
        return this.http.post<any>(`${environment.apiUrl}/Insurance`,
            formData
            , this.httpOptions)
            .pipe(tap((res: any) => {
                return res;
            }));
    }

    editInsuranceDetailsmaster(formData: FormData, insuranceId: number) {
        return this.http.put<any>(`${environment.apiUrl}/Insurance/` + insuranceId,
            InsuranceDetailsModel, this.httpOptions)
            .pipe(tap((res: any) => {
                return res;
            }));
    }

    getInsuranceDetailsByKey(insuranceId: number) {
        const data = this.http.get<InsuranceDetailsModel>(this.insuranceDetailsUrl + '/' + insuranceId, this.httpOptions);
        return data;
        //return this.insuranceDetailsDataCache.find(item => item.insuranceId == insuranceId);
    }

    DeleteInsuranceDetails(insuranceId: number) {
        return this.http.delete<any>(`${environment.apiUrl}/Insurance/` + insuranceId, this.httpOptions)
            .pipe(tap((res: any) => {
                return res;
            }));
    }

    DeleteFromCache(insuranceId: number) {
        const objIndex = this.insuranceDetailsDataCache.findIndex(item => item.insuranceId == insuranceId);
        this.insuranceDetailsDataCache.splice(objIndex, 1);

    }

    AddOrEditRecordToCache(insuranceDetailsModel: InsuranceDetailsModel, editMode: boolean) {
        if (editMode) {
            const objIndex = this.insuranceDetailsDataCache.findIndex(item => item.insuranceId == insuranceDetailsModel.insuranceId);
            this.insuranceDetailsDataCache[objIndex] = insuranceDetailsModel;
        }
        else {
            this.insuranceDetailsDataCache.push(insuranceDetailsModel);
            this.insuranceDetailsDataCache.sort((a, b) => (a.serialNo > b.serialNo) ? 1 : -1);
        }
    }
}