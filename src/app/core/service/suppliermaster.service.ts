import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { SupplierMasterModel } from '../../shared/model//SupplierMasterModel';

@Injectable({
    providedIn: 'root'
})
export class SupplierMasterService {
    supplierMasterDataCache: SupplierMasterModel[] = [];
    token = localStorage.getItem('access_token');
    supplierMasterDataByKey!: SupplierMasterModel;
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

    private supplierMasterUrl = `${environment.apiUrl}/Supplier`;

    async getSupplierMaster() {
        if (!(this.supplierMasterDataCache.length > 0)) {
            const data = await this.http.get<SupplierMasterModel[]>(this.supplierMasterUrl, this.httpOptions)
                .toPromise();
            this.supplierMasterDataCache = data;
            return data;
        }
        else {
            return this.supplierMasterDataCache;
        }
    }

    async onRefreshSupplierMaster() {
        const data = await this.http.get<SupplierMasterModel[]>(this.supplierMasterUrl, this.httpOptions).toPromise();
        if (data == null) {
            this.supplierMasterDataCache = [];
          } else {
            this.supplierMasterDataCache = data;
          }
          return this.supplierMasterDataCache;
    }

    addSuppliermaster(SupplierMasterModel: SupplierMasterModel) {
        return this.http.post<any>(`${environment.apiUrl}/Supplier`,
            SupplierMasterModel
            , this.httpOptions)
            .pipe(tap((res: any) => {
                return res;
            }));
    }

    editSuppliermaster(supplierMasterModel: SupplierMasterModel) {
        return this.http.put<any>(`${environment.apiUrl}/Supplier/` + supplierMasterModel.supplierId,
            supplierMasterModel, this.httpOptions)
            .pipe(tap((res: any) => {
                return res;
            }));
    }
    getSupplierMasterByKey(supplierId: number) {
        return this.supplierMasterDataCache.find(item => item.supplierId == supplierId);
    }

    AddOrEditRecordToCache(supplierMasterModel: SupplierMasterModel, editMode: boolean) {
        if (editMode) {
            const objIndex = this.supplierMasterDataCache.findIndex(item => item.supplierId == supplierMasterModel.supplierId);
            this.supplierMasterDataCache[objIndex] = supplierMasterModel;
        }
        else {
            this.supplierMasterDataCache.push(supplierMasterModel);
            this.supplierMasterDataCache.sort((a, b) => (a.supplierCode > b.supplierCode) ? 1 : -1);
        }
    }

    DeleteSupplierMaster(supplierId: number) {
        return this.http.delete<any>(`${environment.apiUrl}/Supplier/` + supplierId, this.httpOptions)
            .pipe(tap((res: any) => {
                return res;
            }));
    }

    DeleteFromCache(supplierId: number) {
        const objIndex = this.supplierMasterDataCache.findIndex(item => item.supplierId == supplierId);
        this.supplierMasterDataCache.splice(objIndex, 1);

    }
}