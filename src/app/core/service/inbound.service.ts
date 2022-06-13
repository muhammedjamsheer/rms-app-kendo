import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { PurchaseDocumentLines, InboundFilter, PurchaseOrderHeader } from '../../shared/model/inbound.model';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Observable, of } from "rxjs";
import { prepareHttpParams } from '../../_helpers/utils';
@Injectable({
  providedIn: 'root'
})
export class InboundService {
  private dataCache: PurchaseOrderHeader[] = [];
  purchaseordercache: any[] = [];
  purchasereturncahe: any[] = [];
  selectedrowevent = new Subject<any>();
  refreshClickevent = new Subject<any>();
  token = localStorage.getItem('access_token');
  private apiUrl = `${environment.apiUrl}/PurchaseOrder/PoHeaders`;
  private apidetUrl = `${environment.apiUrl}/PurchaseOrder`;
  private apiprintUrl = `${environment.apiUrl}/PurchaseOrder/PoPrintLines`;
  private apiposummary = `${environment.apiUrl}/purchaseOrder/posummary`;
  private apiporeturnsummary = `${environment.apiUrl}/purchaseOrder/poreturnSummary`;

  headers = new HttpHeaders()
    .set('Authorization', "Bearer " + this.token)
    .set('Content-Type', 'application/json');
  httpOptions = {
    headers: this.headers
  };
  selectedDoc!: PurchaseOrderHeader | null;
  filters!: InboundFilter;

  constructor(private http: HttpClient) {
    console.log('Inbound Service Initialised',
    );
  }

  getDocumentHeaders(filters: InboundFilter): Observable<PurchaseOrderHeader[]> {
    this.filters = filters;
    return this.http.get<PurchaseOrderHeader[]>(
      this.apiUrl, { params: prepareHttpParams(filters) })
      .pipe(tap((res: PurchaseOrderHeader[]) => {
        this.dataCache = res;
        return res;
      }));
  }

  getDocumentDetails(poNumber: string): Observable<PurchaseDocumentLines[]> {
    return this.http.get<PurchaseDocumentLines[]>(this.apidetUrl + '/' + poNumber);
  }
  getDocumentprintDetails(poId: number): Observable<PurchaseDocumentLines[]> {
    return this.http.get<PurchaseDocumentLines[]>(this.apiprintUrl + '/' + poId);
  }

  async getpurchaseorders() {
    const data = await this.http.get<any[]>(this.apiUrl, this.httpOptions).toPromise();
    return data;
  }

  getpurchaseorderSummary(id: number) {
    return this.http.get<any>(this.apiposummary + '/' + id, this.httpOptions).pipe(tap((res: any) => {
      return res;
    }));
  }
  //purchase return
  async getPurchaseReturn() {
    if (!(this.purchasereturncahe.length > 0)) {
      const data = await this.http.get<any[]>(this.apidetUrl + "/PoreturnHeader", this.httpOptions).toPromise();
      this.purchasereturncahe = data;
      return data;
    }
    else {
      return this.purchasereturncahe;
    }
  }
  async onRefreshpurchaseReturn() {
    const data = await this.http.get<any[]>(this.apidetUrl + "/PoreturnHeader", this.httpOptions).toPromise();
    if (data == null) {
      this.purchasereturncahe = [];
    } else {
      this.purchasereturncahe = data;
    }
    return this.purchasereturncahe;
  }
  getpurchaseorderReturnSummary(id: number) {
    return this.http.get<any>(this.apiporeturnsummary + '/' + id, this.httpOptions).pipe(tap((res: any) => {
      return res;
    }));
  }
  getPurchaseReturnReport(filters: InboundFilter): Observable<PurchaseOrderHeader[]> {
    this.filters = filters;
    return this.http.get<PurchaseOrderHeader[]>(
      this.apidetUrl + "/PoreturnHeader", { params: prepareHttpParams(filters) })
      .pipe(tap((res: PurchaseOrderHeader[]) => {
        this.dataCache = res;
        return res;
      }));
  }
}