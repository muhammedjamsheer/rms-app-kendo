import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { BuildingMasterModel } from '../../shared/model//BuildingMasterModel';

@Injectable({ providedIn: 'root' })
export class BuildingmasterService {
    buildingmasterDataCache: BuildingMasterModel[] = [];
    buildingMasterDataByKey!: BuildingMasterModel;
    selectedrowevent = new Subject<any>();
    refreshClickevent = new Subject<any>();

    constructor(private http: HttpClient) { }

    private buildingMasterUrl = `${environment.apiUrl}/Building`;

    async getBuildingMaster() {
        if (!(this.buildingmasterDataCache.length > 0)) {
            const data = await this.http.get<BuildingMasterModel[]>(this.buildingMasterUrl)
                .toPromise(); 
            this.buildingmasterDataCache = data;
            return data;
        }
        else {
            return this.buildingmasterDataCache;
        }
    }

    async onRefreshBuildingmaster() {
        const data = await this.http.get<BuildingMasterModel[]>(this.buildingMasterUrl)
            .toPromise();
        this.buildingmasterDataCache = data;
        return this.buildingmasterDataCache;
    }

    addBuildingmaster(buildingmastermodel: BuildingMasterModel) {
        return this.http.post<any>(`${environment.apiUrl}/Building`, buildingmastermodel)
            .pipe(tap((res: any) => {
                return res;
            }));
    }

    editBuildingmaster(buildingmastermodel: BuildingMasterModel) {
        return this.http.put<any>(`${environment.apiUrl}/Building/` + buildingmastermodel.buildingID,
            buildingmastermodel).pipe(tap((res: any) => {
                return res;
            }));
    }

    getBuildingMasterByKey(buildingID: number) {
        return this.buildingmasterDataCache.find(item => item.buildingID == buildingID);
    }

    AddOrEditRecordToCache(buildingmastermodel: BuildingMasterModel, editMode: boolean) {
        if (editMode) {
            const objIndex = this.buildingmasterDataCache
                .findIndex(item => item.buildingID == buildingmastermodel.buildingID);
            this.buildingmasterDataCache[objIndex] = buildingmastermodel;
        }
        else {
            this.buildingmasterDataCache.push(buildingmastermodel);
            this.buildingmasterDataCache.sort((a, b) => (a.buildingCode > b.buildingCode) ? 1 : -1);
        }
    }

    DeleteBuildingMaster(buildingID: number) {
        return this.http.delete<any>(`${environment.apiUrl}/Building/` + buildingID)
            .pipe(tap((res: any) => {
                return res;
            }));
    }

    DeleteFromCache(buildingID: number) {
        const objIndex = this.buildingmasterDataCache
            .findIndex(item => item.buildingID == buildingID);
        this.buildingmasterDataCache.splice(objIndex, 1);
    }
}