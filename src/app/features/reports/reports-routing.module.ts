import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportNumbers } from 'src/app/shared/Reports/ReportNumbers';
import { AuthGuard } from '../../_helpers';
import { AssetcountstatuswisereportComponent } from './assetcountstatuswisereport/assetcountstatuswisereport.component';
import { AssethistoryreportComponent } from './assethistoryreport/assethistoryreport.component';
import { AssetregisterreportComponent } from './assetregistereport/assetregisterreport/assetregisterreport.component';
import { CategorywisereportComponent } from './categorywisereport/categorywisereport.component';
import { CategorywisevaluereportComponent } from './categorywisevaluereport/categorywisevaluereport.component';
import { DepartmentwisereportComponent } from './departmentwisereport/departmentwisereport.component';
import { EmployeewisereportComponent } from './employeewisereport/employeewisereport.component';
import { LocationwisereportComponent } from './locationwisereport/locationwisereport.component';
import { ProductsummaryreportComponent } from './productsummaryreport/productsummaryreport.component';
import { ReportsComponent } from './reports.component';
import { ReportsfilterformComponent } from './reportsfilterform/reportsfilterform.component';
import { PurchaseorderreportComponent } from './purchaseorderreport/purchaseorderreport.component';

const routes: Routes = [{ path: '', component: ReportsComponent },
{ path: 'assetregisterreportview', component: AssetregisterreportComponent, canActivate: [AuthGuard] },
{ path: 'locationwisereportview', component: LocationwisereportComponent, canActivate: [AuthGuard] },
{ path: 'categorywisereportview', component: CategorywisereportComponent, canActivate: [AuthGuard] },
{ path: 'categorywisevaluereportview', component: CategorywisevaluereportComponent, canActivate: [AuthGuard] },
{ path: 'departmentwisereportview', component: DepartmentwisereportComponent, canActivate: [AuthGuard] },
{ path: 'employeewisereportview', component: EmployeewisereportComponent, canActivate: [AuthGuard] },
{ path: 'assethistoryreportview', component: AssethistoryreportComponent, canActivate: [AuthGuard] },
{ path: 'productsummaryreportview', component: ProductsummaryreportComponent, canActivate: [AuthGuard] },
{ path: 'assetcountstatuswisereportview', component: AssetcountstatuswisereportComponent, canActivate: [AuthGuard] },
{ path: 'assetregisterreport', component: AssetregisterreportComponent, canActivate: [AuthGuard], data: {reportType: ReportNumbers.assetregisterreport} },
{ path: 'locationwisereport', component: LocationwisereportComponent, canActivate: [AuthGuard], data: {reportType: ReportNumbers.locationwisereport} },
{ path: 'categorywisereport', component: CategorywisereportComponent, canActivate: [AuthGuard], data: {reportType: ReportNumbers.categorywisereport} },
{ path: 'categorywisevaluereport', component: CategorywisevaluereportComponent, canActivate: [AuthGuard], data: {reportType: ReportNumbers.categorywisevaluereport} },
{ path: 'assetcountstatuswisereport', component: AssetcountstatuswisereportComponent, canActivate: [AuthGuard], data: {reportType: ReportNumbers.assetcountstatuswisereport} },
{ path: 'departmentwisereport', component: DepartmentwisereportComponent, canActivate: [AuthGuard], data: {reportType: ReportNumbers.departmentwisereport} },
{ path: 'employeewisereport', component: EmployeewisereportComponent, canActivate: [AuthGuard], data: {reportType: ReportNumbers.employeewisereport} },
{ path: 'assethistoryreport', component: AssethistoryreportComponent, canActivate: [AuthGuard], data: {reportType: ReportNumbers.assethistoryreport} },
{ path: 'productsummaryreport', component: ProductsummaryreportComponent, canActivate: [AuthGuard], data: {reportType: ReportNumbers.productsummaryreport} },
{ path: 'purchaseorderreport', component: PurchaseorderreportComponent, canActivate: [AuthGuard], data: {reportType: ReportNumbers.purchaseorderreport} }



];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
