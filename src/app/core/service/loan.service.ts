import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { LoanModel } from '../../shared/model/LoanModel';

@Injectable({
    providedIn: 'root'
})
export class LoanService {
    loanDataCache: LoanModel[] = [];
    token = localStorage.getItem('access_token');
    loanDataByKey!: LoanModel;
    selectedrowevent = new Subject<any>();
    refreshClickevent = new Subject<any>();
    headers = new HttpHeaders()
        .set('Authorization', "Bearer " + this.token);
    httpOptions = {
        headers: this.headers
    };

    constructor(private http: HttpClient,
        private router: Router) { }

    private loanUrl = `${environment.apiUrl}/Loan`;

    async getLoan() {
        if (!(this.loanDataCache.length > 0)) {
            const data = await this.http.get<LoanModel[]>(this.loanUrl, this.httpOptions)
                .toPromise();
            this.loanDataCache = data;
            return data;
        }
        else {
            return this.loanDataCache;
        }
    }

    async onRefreshLoan() {
        const data = await this.http.get<LoanModel[]>(this.loanUrl, this.httpOptions).toPromise();
        if (data == null) {
            this.loanDataCache = [];
        } else {
            this.loanDataCache = data;
        }
        return this.loanDataCache;
    }

    addLoan(formData: FormData) {
        return this.http.post<any>(`${environment.apiUrl}/Loan`,
            formData
            , this.httpOptions)
            .pipe(tap((res: any) => {
                return res;
            }));
    }

    editLoanmaster(formData: FormData, releaseNo: string) {
        return this.http.put<any>(`${environment.apiUrl}/loan/` + releaseNo,
            formData, this.httpOptions)
            .pipe(tap((res: any) => {
                return res;
            }));
    }
    getLoanByKey(releaseNo: string) {
        const data = this.http.get<LoanModel>(this.loanUrl + '/' + releaseNo, this.httpOptions);
        return data;
        //return this.loanDataCache.find(item => item.releaseNo == releaseNo);
    }

    DeleteLoan(releaseNo: string) {
        return this.http.delete<any>(`${environment.apiUrl}/loan/` + releaseNo, this.httpOptions)
            .pipe(tap((res: any) => {
                return res;
            }));
    }

    DeleteFromCache(releaseNo: string) {
        const objIndex = this.loanDataCache.findIndex(item => item.releaseNo == releaseNo);
        this.loanDataCache.splice(objIndex, 1);

    }

    AddOrEditRecordToCache(assetTransferDirectModel: LoanModel, editMode: boolean) {
        if (editMode) {
            const objIndex = this.loanDataCache.findIndex(item => item.releaseNo == assetTransferDirectModel.releaseNo);
            this.loanDataCache[objIndex] = assetTransferDirectModel;
        }
        else {
            this.loanDataCache.push(assetTransferDirectModel);
            this.loanDataCache.sort((a, b) => (a.releaseNo > b.releaseNo) ? 1 : -1);
        }
    }

    ApproveRequest(releaseNo: string) {
        return this.http.post<any>(`${environment.apiUrl}/loan/directrelease?releaseNo=` + releaseNo,
            null
            , this.httpOptions)
            .pipe(tap((res: any) => {
                return res;
            }));
    }

    ProcessInMobileRequest(releaseNo: string) {
        return this.http.post<any>(`${environment.apiUrl}/loan/issueinmobile?releaseNo=` + releaseNo,
            null
            , this.httpOptions)
            .pipe(tap((res: any) => {
                return res;
            }));
    }
}