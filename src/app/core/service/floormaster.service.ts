import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { FloorMasterModel } from '../../shared/model//FloorMasterModel';

@Injectable({
    providedIn: 'root'
})
export class FloormasterService {
    floormasterDataCache: FloorMasterModel[] = [];
    token = localStorage.getItem('access_token');
    floorMasterDataByKey!: FloorMasterModel;
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

    private floorMasterUrl = `${environment.apiUrl}/Floor`;

    async getFloorMaster() {
        if (!(this.floormasterDataCache.length > 0)) {
            const data = await this.http.get<FloorMasterModel[]>(this.floorMasterUrl, this.httpOptions)
                .toPromise();
            this.floormasterDataCache = data;
            return data;
        }
        else {
            return this.floormasterDataCache;
        }
    }

    async onRefreshFloormaster() {
        const data = await this.http.get<FloorMasterModel[]>(this.floorMasterUrl, this.httpOptions)
            .toPromise();
        this.floormasterDataCache = data;
        return data;
    }

    addFloormaster(floormastermodel: FloorMasterModel) {
        return this.http.post<any>(`${environment.apiUrl}/Floor`,
            floormastermodel
            , this.httpOptions)
            .pipe(tap((res: any) => {
                return res;
            }));
    }

    editFloormaster(floormastermodel: FloorMasterModel) {
        return this.http.put<any>(`${environment.apiUrl}/Floor/` + floormastermodel.floorID,
            floormastermodel, this.httpOptions)
            .pipe(tap((res: any) => {
                return res;
            }));
    }
    getFloorMasterByKey(floorID: number) {
        return this.floormasterDataCache.find(item => item.floorID == floorID);
    }

    AddOrEditRecordToCache(floormastermodel: FloorMasterModel, editMode: boolean) {
        if (editMode) {
            const objIndex = this.floormasterDataCache.findIndex(item => item.floorID == floormastermodel.floorID);
            this.floormasterDataCache[objIndex] = floormastermodel;
        }
        else {
            this.floormasterDataCache.push(floormastermodel);
            this.floormasterDataCache.sort((a, b) => (a.floorCode > b.floorCode) ? 1 : -1);
        }
    }

    DeleteFloorMaster(floorID: number) {
        return this.http.delete<any>(`${environment.apiUrl}/Floor/` + floorID, this.httpOptions)
            .pipe(tap((res: any) => {
                return res;
            }));
    }

    DeleteFromCache(floorID: number) {
        const objIndex = this.floormasterDataCache.findIndex(item => item.floorID == floorID);
        this.floormasterDataCache.splice(objIndex, 1);

    }
}