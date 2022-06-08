import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AssetCountAssetStatusWiseModel } from 'src/app/shared/model/AssetCountAssetStatusWiseModel';
import { AssetCountCategoryWiseModel } from 'src/app/shared/model/assetCountCategoryWiseModel';
import { AssetRegisterModel } from 'src/app/shared/model/AssetRegisterModel';
import { AssetRegisterFilterReport } from 'src/app/shared/model/AssetRegisterReport';
import { AssetStatusWiseFilterReport } from 'src/app/shared/model/AssetStatusWiseFilterReport';
import { CategoryWiseFilterReport } from 'src/app/shared/model/CategoryWiseReport';
import { LocationMasterModel } from 'src/app/shared/model/LocationMasterModel';
import { LocationWiseFilterReport } from 'src/app/shared/model/LocationWiseReport';
import { environment } from '../../../environments/environment';
import { ReceiptMasterModel } from '../../shared/model//ReceiptMasterModel';

@Injectable({
    providedIn: 'root'
})
export class ReportsService {
    viewFlag:Subject<boolean> = new Subject<boolean>();
    token = localStorage.getItem('access_token');
    receiptMasterDataByKey!: ReceiptMasterModel;
    assetreportsummaryFilter:AssetRegisterFilterReport = new AssetRegisterFilterReport;
    locationWiseReportSummaryFilter:LocationWiseFilterReport = new LocationWiseFilterReport;
    categoryWiseReportSummaryFilter:CategoryWiseFilterReport=new CategoryWiseFilterReport;
    assetStatusWiseFilterReport: AssetStatusWiseFilterReport = new AssetStatusWiseFilterReport;
    departmentWiseSummaryFilter: AssetRegisterFilterReport = new AssetRegisterFilterReport;
    employeeWisesummaryFilter: AssetRegisterFilterReport = new AssetRegisterFilterReport;
    headers = new HttpHeaders()
        .set('Authorization', "Bearer " + this.token)
        .set('Content-Type', 'application/json');
    httpOptions = {
        headers: this.headers
    };

    constructor(private http: HttpClient,
        private router: Router) { }

    private reportsUrl = `${environment.apiUrl}/Reports`;

    async getAssetRegisterReport(assetFilterReport: AssetRegisterFilterReport) {
            return await this.http.post<AssetRegisterModel[]>(this.reportsUrl + '/assets/filter', assetFilterReport, this.httpOptions)
                .toPromise();
        
    }

    async getProductSummaryReport(assetFilterReport: AssetRegisterFilterReport) {
        return await this.http.post<AssetRegisterModel[]>(`${environment.apiUrl}` + '/Asset/GetAssetSummary', assetFilterReport, this.httpOptions)
            .toPromise();
    
}

    setViewFlag(dir:boolean)
  {
    this.viewFlag.next(dir);
  }

    async getAssetHistoryReport(assetFilterReport: CategoryWiseFilterReport) {
        return await this.http.post<AssetRegisterModel[]>(`${environment.apiUrl}` + '/Asset/GetAllAsset', assetFilterReport, this.httpOptions)
            .toPromise();
    
}

async getAssetHistoryDetailReport(serialNo: string) {
    return await this.http.get<AssetRegisterModel[]>(`${environment.apiUrl}` + '/Asset/GetAssetHistory/' + serialNo, this.httpOptions)
        .toPromise();

}

    async getLocationWiseReport(locationFilterReport: LocationWiseFilterReport) {
        return await this.http.post<LocationMasterModel[]>(this.reportsUrl + '/assets/locationwisecount', locationFilterReport, this.httpOptions)
            .toPromise();
    }

    async getCategoryWiseReport(categoryFilterReport: CategoryWiseFilterReport) {
        return await this.http.post<AssetCountCategoryWiseModel[]>(this.reportsUrl + '/assets/categorywisecount', categoryFilterReport, this.httpOptions)
            .toPromise();
    }
    async getCategoryWiseValueReport(categoryFilterReport: CategoryWiseFilterReport) {
        return await this.http.post<AssetCountCategoryWiseModel[]>(this.reportsUrl + '/assets/categorywisevalue', categoryFilterReport, this.httpOptions)
            .toPromise();
    }
    async getAssetStatusWiseReport(assetStatusWiseFilterReport: AssetStatusWiseFilterReport) {
        return await this.http.post<AssetCountAssetStatusWiseModel[]>(this.reportsUrl + '/assets/statuswisecount', assetStatusWiseFilterReport, this.httpOptions)
            .toPromise();
    }
}