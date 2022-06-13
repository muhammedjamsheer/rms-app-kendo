import { DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';
import { FileUploadModule } from 'ng2-file-upload';
import { TreeviewModule } from 'ngx-treeview';
import { ModalModule } from '../../core/_modal';
import { SharedModule } from '../../shared/shared.module';
import { MasterRoutingModule } from '../master/master-routing.module';
import { TransactionRoutingModule } from '../transaction/transaction-routing.module';
import { AssetcountstatuswisereportComponent } from './assetcountstatuswisereport/assetcountstatuswisereport.component';
import { AssetregisterreportComponent } from './assetregistereport/assetregisterreport/assetregisterreport.component';
import { CategorywisereportComponent } from './categorywisereport/categorywisereport.component';
import { CategorywisevaluereportComponent } from './categorywisevaluereport/categorywisevaluereport.component';
import { DepartmentwisereportComponent } from './departmentwisereport/departmentwisereport.component';
import { LocationwisereportComponent } from './locationwisereport/locationwisereport.component';
import { ReportsRoutingModule } from './reports-routing.module';
import { ReportsComponent } from './reports.component';
import { ReportsfilterformComponent } from './reportsfilterform/reportsfilterform.component';
import { EmployeewisereportComponent } from './employeewisereport/employeewisereport.component';
import { AssethistoryreportComponent } from './assethistoryreport/assethistoryreport.component';
import { ProductsummaryreportComponent } from './productsummaryreport/productsummaryreport.component';
import { PurchaseorderreportComponent } from './purchaseorderreport/purchaseorderreport.component';
import { SalesorderreportComponent } from './salesorderreport/salesorderreport.component';
import { TransferorderreportComponent } from './transferorderreport/transferorderreport.component';

@NgModule({
  declarations: [ReportsComponent, AssetregisterreportComponent, LocationwisereportComponent, CategorywisereportComponent, ReportsfilterformComponent, CategorywisevaluereportComponent, AssetcountstatuswisereportComponent, DepartmentwisereportComponent, EmployeewisereportComponent, AssethistoryreportComponent, ProductsummaryreportComponent, PurchaseorderreportComponent, SalesorderreportComponent, TransferorderreportComponent],
  imports: [
    SharedModule,
    ReportsRoutingModule,
    TransactionRoutingModule,
    SharedModule,
    FormsModule,
    MasterRoutingModule,
    ReactiveFormsModule,
    FileUploadModule,    
    ModalModule,
    AgGridModule.withComponents([]),
    TreeviewModule.forRoot()
  ],
  exports: [
  ],
  providers: [DatePipe]
})
export class ReportsModule { }
