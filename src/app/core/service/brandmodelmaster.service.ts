import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { BrandModelMasterModel } from '../../shared/model/BrandModelMasterModel';

@Injectable({
    providedIn: 'root'
})
export class BrandmodelmasterService {
    brandmodelmasterDataCache: BrandModelMasterModel[] = [];
    token = localStorage.getItem('access_token');
    brandmodelMasterDataByKey!: BrandModelMasterModel;
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

    private brandmodelMasterUrl = `${environment.apiUrl}/Model`;

    async getBrandmodelMaster() {
        if (!(this.brandmodelmasterDataCache.length > 0)) {
            const data = await this.http.get<BrandModelMasterModel[]>(this.brandmodelMasterUrl, this.httpOptions)
                .toPromise();
            this.brandmodelmasterDataCache = data;
            return data;
        }
        else {
            return this.brandmodelmasterDataCache;
        }
    }

    async onRefreshBrandmodelmaster() {
        const data = await this.http.get<BrandModelMasterModel[]>(this.brandmodelMasterUrl, this.httpOptions)
            .toPromise();
        this.brandmodelmasterDataCache = data;
        return this.brandmodelmasterDataCache;
    }

    addBrandmodelmaster(brandmodelmastermodel: BrandModelMasterModel) {
        return this.http.post<any>(`${environment.apiUrl}/Model`,
            brandmodelmastermodel
            , this.httpOptions)
            .pipe(tap((res: any) => {
                return res;
            }));
    }

    editBrandmodelmaster(brandmodelmastermodel: BrandModelMasterModel) {
        return this.http.put<any>(`${environment.apiUrl}/Model/` + brandmodelmastermodel.modelID,
            brandmodelmastermodel, this.httpOptions)
            .pipe(tap((res: any) => {
                return res;
            }));
    }
    getBrandmodelMasterByKey(modelID: number) {
        return this.brandmodelmasterDataCache.find(item => item.modelID == modelID);
    }

    AddOrEditRecordToCache(brandmodelmastermodel: BrandModelMasterModel, editMode: boolean) {
        if (editMode) {
            const objIndex = this.brandmodelmasterDataCache.findIndex(item => item.modelID == brandmodelmastermodel.modelID);
            this.brandmodelmasterDataCache[objIndex] = brandmodelmastermodel;
        }
        else {
            this.brandmodelmasterDataCache.push(brandmodelmastermodel);
            this.brandmodelmasterDataCache.sort((a, b) => (a.modelCode > b.modelCode) ? 1 : -1);
        }
    }

    DeleteBrandmodelMaster(modelID: number) {
        return this.http.delete<any>(`${environment.apiUrl}/Model/` + modelID, this.httpOptions)
            .pipe(tap((res: any) => {
                return res;
            }));
    }

    DeleteFromCache(modelID: number) {
        const objIndex = this.brandmodelmasterDataCache.findIndex(item => item.modelID == modelID);
        this.brandmodelmasterDataCache.splice(objIndex, 1);

    }
}