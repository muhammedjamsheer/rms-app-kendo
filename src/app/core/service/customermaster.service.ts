import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { CustomerMasterModel } from '../../shared/model//CustomerMasterModel';

@Injectable({
    providedIn: 'root'
})
export class CustomerMasterService {
    customerMasterDataCache: CustomerMasterModel[] = [];
    CustomerdetailsDataCache: any[] = [];
    token = localStorage.getItem('access_token');
    customerMasterDataByKey!: CustomerMasterModel;
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

    private customerMasterUrl = `${environment.apiUrl}/Customer/customers`;
    private customerapi = `${environment.apiUrl}/customer/customers`;
    private customerdetailsapi = `${environment.apiUrl}/customer/customerAddress/`;

    async getCustomerMaster() {
        if (!(this.customerMasterDataCache.length > 0)) {
            const data = await this.http.get<CustomerMasterModel[]>(this.customerMasterUrl, this.httpOptions)
                .toPromise();
            this.customerMasterDataCache = data;
            return data;
        }
        else {
            return this.customerMasterDataCache;
        }
    }

    async onRefreshCustomerMaster() {
        const data = await this.http.get<CustomerMasterModel[]>(this.customerMasterUrl, this.httpOptions).toPromise();
        if (data == null) {
            this.customerMasterDataCache = [];
        } else {
            this.customerMasterDataCache = data;
        }
        return this.customerMasterDataCache;
    }

    addCustomermaster(CustomerMasterModel: CustomerMasterModel) {
        return this.http.post<any>(`${environment.apiUrl}/Customer`,
            CustomerMasterModel
            , this.httpOptions)
            .pipe(tap((res: any) => {
                return res;
            }));
    }

    editCustomermaster(customerMasterModel: CustomerMasterModel) {
        return this.http.put<any>(`${environment.apiUrl}/Customer/` + customerMasterModel.customerId,
            customerMasterModel, this.httpOptions)
            .pipe(tap((res: any) => {
                return res;
            }));
    }
    getCustomerMasterByKey(customerId: number) {
        return this.customerMasterDataCache.find(item => item.customerId == customerId);
    }

    AddOrEditRecordToCache(customerMasterModel: CustomerMasterModel, editMode: boolean) {
        if (editMode) {
            const objIndex = this.customerMasterDataCache.findIndex(item => item.customerId == customerMasterModel.customerId);
            this.customerMasterDataCache[objIndex] = customerMasterModel;
        }
        else {
            this.customerMasterDataCache.push(customerMasterModel);
            this.customerMasterDataCache.sort((a, b) => (a.customerCode > b.customerCode) ? 1 : -1);
        }
    }

    DeleteCustomerMaster(customerId: number) {
        return this.http.delete<any>(`${environment.apiUrl}/Customer/` + customerId, this.httpOptions)
            .pipe(tap((res: any) => {
                return res;
            }));
    }

    DeleteFromCache(customerId: number) {
        const objIndex = this.customerMasterDataCache.findIndex(item => item.customerId == customerId);
        this.customerMasterDataCache.splice(objIndex, 1);

    }
    getCustomerdetails(id: number) {
        return this.http.get<any>(this.customerdetailsapi + id, this.httpOptions).pipe(tap((res: any) => {
            return res;
        }));
    }

    async getCustomersList() {
        if (!(this.CustomerdetailsDataCache.length > 0)) {
            const data = await this.http.get<any[]>(this.customerapi, this.httpOptions).toPromise();
            this.CustomerdetailsDataCache = data;
            return data;
        }
        else {
            return this.CustomerdetailsDataCache;
        }
    }
}