import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { DashboardCardsGroupModel } from '../../shared/model/DashboardCardsGroupModel';

@Injectable({
    providedIn: 'root'
})
export class DashboardService {
    dashboardCardsGroupDataCache!: DashboardCardsGroupModel;
    token = localStorage.getItem('access_token');
    dashboardCardsGroupDataByKey!: DashboardCardsGroupModel;
    headers = new HttpHeaders()
        .set('Authorization', "Bearer " + this.token)
        .set('Content-Type', 'application/json');
    httpOptions = {
        headers: this.headers
    };

    constructor(private http: HttpClient,
        private router: Router) { }

    private dashboardUrl = `${environment.apiUrl}/Dashboard`;

    async getDashboardCardsGroup() : Promise<DashboardCardsGroupModel>{
        if (!this.dashboardCardsGroupDataCache) {
            this.dashboardCardsGroupDataCache  = await this.http.get<DashboardCardsGroupModel>(this.dashboardUrl + '/cardsgroup' , this.httpOptions).toPromise();
             return this.dashboardCardsGroupDataCache;
        }
        else {
            return this.dashboardCardsGroupDataCache;
        }
    }

    async getAssetcountbylocation(locationId: number){
        const data  = await this.http.get<any[]>(this.dashboardUrl + '/assetcountbylocation/' + locationId , this.httpOptions).toPromise();
        return data;
        
    }

    async getAssetcountbyBuilding(buildingId: number){
        const data  = await this.http.get<any[]>(this.dashboardUrl + '/assetcountbybuilding/' + buildingId , this.httpOptions).toPromise();
        return data;
        
    }

    async getAssetcountbyDepartment(departmentId: number){
        const data  = await this.http.get<any[]>(this.dashboardUrl + '/assetcountbydepartment/' + departmentId , this.httpOptions).toPromise();
        return data;
        
    }

    async getAssetcountbyCategory(categoryId: number){
        const data  = await this.http.get<any[]>(this.dashboardUrl + '/assetcountbycategory/' + categoryId , this.httpOptions).toPromise();
        return data;
        
    }

    async getAssetcostbyCategory(categoryId: number){
        const data  = await this.http.get<any[]>(this.dashboardUrl + '/assetcostbycategory/' + categoryId , this.httpOptions).toPromise();
        return data;
        
    }

    async getAssetsInlocation(locationId: number){
        const data  = await this.http.get<any[]>(this.dashboardUrl + '/assetsInlocation/' + locationId , this.httpOptions).toPromise();
        return data;
        
    }

    async getAssetscountbystatus(){
        const data  = await this.http.get<any[]>(this.dashboardUrl + '/Assetscountbystatus' , this.httpOptions).toPromise();
        return data;
        
    }

    async getMaintenanceScheduleAlert(){
        const data  = await this.http.get<any[]>(this.dashboardUrl + '/maintenanceschedule' , this.httpOptions).toPromise();
        return data;
        
    }

    async getTransactionhistory(){
        const data  = await this.http.get<any[]>(this.dashboardUrl + '/transactionhistory' , this.httpOptions).toPromise();
        return data;
        
    }

    async getValuebycategoryfordepartment(departmentId: number){
        const data  = await this.http.get<any[]>(this.dashboardUrl + '/valuebycategoryfordepartment/' + departmentId , this.httpOptions).toPromise();
        return data;
        
    }
}