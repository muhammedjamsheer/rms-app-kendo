import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ProductMasterModel } from '../../shared/model//ProductMasterModel';

@Injectable({
    providedIn: 'root'
})
export class ProductMasterService {
    productmasterDataCache: ProductMasterModel[] = [];
    productexistingDataCache: any[] = [];
    token = localStorage.getItem('access_token');
    productMasterDataByKey!: ProductMasterModel;
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

    private productMasterUrl = `${environment.apiUrl}/Product`;
    private getexistingpdturl = `${environment.apiUrl}/itemmaster/Products`;

    async getProductMaster() {
        if (!(this.productmasterDataCache.length > 0)) {
            const data = await this.http.get<ProductMasterModel[]>(this.productMasterUrl, this.httpOptions)
                .toPromise();
            this.productmasterDataCache = data;
            return data;
        }
        else {
            return this.productmasterDataCache;
        }
    }



    addProductmaster(productmastermodel: ProductMasterModel) {
        return this.http.post<any>(`${environment.apiUrl}/Product`,
            productmastermodel
            , this.httpOptions)
            .pipe(tap((res: any) => {
                return res;
            }));
    }

    editProductmaster(productmastermodel: ProductMasterModel) {
        return this.http.put<any>(`${environment.apiUrl}/Product/` + productmastermodel.productId,
            productmastermodel, this.httpOptions)
            .pipe(tap((res: any) => {
                return res;
            }));
    }
    getProductMasterByKey(productID: number) {
        return this.productmasterDataCache.find(item => item.productId == productID);
    }

    AddOrEditRecordToCache(productmastermodel: ProductMasterModel, editMode: boolean) {
        if (editMode) {
            const objIndex = this.productmasterDataCache.findIndex(item => item.productId == productmastermodel.productId);
            this.productmasterDataCache[objIndex] = productmastermodel;
        }
        else {
            this.productmasterDataCache.push(productmastermodel);
            this.productmasterDataCache.sort((a, b) => (a.productCode > b.productCode) ? 1 : -1);
        }
    }

    DeleteProductMaster(productID: number) {
        return this.http.delete<any>(`${environment.apiUrl}/Product/` + productID, this.httpOptions)
            .pipe(tap((res: any) => {
                return res;
            }));
    }

    DeleteFromCache(productID: number) {
        const objIndex = this.productmasterDataCache.findIndex(item => item.productId == productID);
        this.productmasterDataCache.splice(objIndex, 1);

    }

    async getExistingProduct() {
        if (!(this.productexistingDataCache.length > 0)) {
            const data = await this.http.get<ProductMasterModel[]>(this.getexistingpdturl, this.httpOptions)
                .toPromise();
            this.productexistingDataCache = data;
            return data;
        }
        else {
            return this.productexistingDataCache;
        }
    }
    async onRefreshProductmaster() {
        const data = await this.http.get<ProductMasterModel[]>(this.getexistingpdturl, this.httpOptions).toPromise();
        if (data == null) {
            this.productmasterDataCache = [];
        } else {
            this.productmasterDataCache = data;
        }
        return this.productmasterDataCache;
    }
}