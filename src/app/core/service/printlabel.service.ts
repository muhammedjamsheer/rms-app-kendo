import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { Observable, of } from "rxjs";
import { environment } from '../../../environments/environment';
import { PrintLabelModel } from '../../shared/model//PrintLabelModel';
import { PurchaseDocumentLines, InboundFilter, PurchaseOrderHeader } from '../../shared/model/inbound.model';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PrintLabelService {
    labelDesignDataCache: string[] = [];
    strArray: string[] = [];
    token = localStorage.getItem('access_token');
    selectedrowevent = new Subject<any>();
    private apiprintUrl = `${environment.apiUrl}/PrintLabels/GenerateSerialNo`;
    
    headers = new HttpHeaders()
        .set('Authorization', "Bearer " + this.token)
        .set('Content-Type', 'application/json');
    httpOptions = {
        headers: this.headers
    };

    constructor(private http: HttpClient,
        private router: Router) { }
        // /rms/PrintLabels/GenerateSerialNo
    private printLabelMasterUrl = `${environment.apiUrl}/PrintLabels/LabelDesigns`;
    

    async getPrintLabelDesign() {
        if (!(this.labelDesignDataCache.length > 0)) {
            const data = await this.http.get<string[]>(this.printLabelMasterUrl, this.httpOptions)
                .toPromise();
            this.labelDesignDataCache = data;
            return data;
        }
        else {
            return this.labelDesignDataCache;
        }
    }

    async getPrintLabelDesignData(fileName:string) {
        const data = await this.http.get<string>(`${environment.apiUrl}/PrintLabels/GetLabelDesignData/` + fileName, this.httpOptions)
        .toPromise();
    return data;
    }

    getPrintLabel(printLabelmastermodel: PrintLabelModel) {
        return this.http.post<any>(`${environment.apiUrl}/PrintLabels/SerialNumberDesign`,
            printLabelmastermodel
            , this.httpOptions)
            .pipe(tap((res: any) => {
                return res;
            }));
    }
  
    

    async getGeneratedSerailNo(printArray:string[]) {
       
        const data = await this.http.post<string>(`${environment.apiUrl}/PrintLabels/GenerateSerialNo/`,printArray, this.httpOptions)
        .toPromise();

    return data;
    }
    updatePrintStatus(serialNo: string[]) {
        return this.http.post<any>(`${environment.apiUrl}/Asset/UpdatePrintedStatus`,
        serialNo
            , this.httpOptions)
            .pipe(tap((res: any) => {
                return res;
            }));
    }
}