import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../_helpers';
import { AdditionalcostdetailsformComponent } from './additionalcostdetails/additionalcostdetailsform/additionalcostdetailsform.component';
import { AdditionalcostdetailsgridComponent } from './additionalcostdetails/additionalcostdetailsgrid/additionalcostdetailsgrid.component';
import { AssetauditformComponent } from './assetaudit/assetauditform/assetauditform.component';
import { AssetauditgridComponent } from './assetaudit/assetauditgrid/assetauditgrid.component';
import { AssetsummaryComponent } from './assetaudit/assetsummary/assetsummary.component';
import { AssetdisposalformComponent } from './assetdisposal/assetdisposalform/assetdisposalform.component';
import { AssetfileuploadComponent } from './assetfileupload/assetfileupload.component';
import { AssetmaintenanceformComponent } from './assetmaintenance/assetmaintenanceform/assetmaintenanceform.component';
import { AssetmaintenancegridComponent } from './assetmaintenance/assetmaintenancegrid/assetmaintenancegrid.component';
import { AssetregisterformComponent } from './assetregister/assetregisterform/assetregisterform.component';
import { AssetregistergridComponent } from './assetregister/assetregistergrid/assetregistergrid.component';
import { AssettransferdirectformComponent } from './assettransferdirect/assettransferdirectform/assettransferdirectform.component';
import { AssettransferdirectgridComponent } from './assettransferdirect/assettransferdirectgrid/assettransferdirectgrid.component';
import { AssettransferverificationComponent } from './assettransferdirect/assettransferverification/assettransferverification.component';
import { AssettransferrequestformComponent } from './assettransferrequest/assettransferrequestform/assettransferrequestform.component';
import { AssettransferrequestgridComponent } from './assettransferrequest/assettransferrequestgrid/assettransferrequestgrid.component';
import { AssetverificationformComponent } from './assetverification/assetverificationform/assetverificationform.component';
import { AuditdiscrepancyformComponent } from './auditdiscrepancy/auditdiscrepancyform/auditdiscrepancyform.component';
import { AuditverifyformComponent } from './auditverify/auditverifyform/auditverifyform.component';
import { DocumenttagprintComponent } from './documenttagprint/documenttagprint.component';
import { InsurancedetailsformComponent } from './insurancedetails/insurancedetailsform/insurancedetailsform.component';
import { InsurancedetailsgridComponent } from './insurancedetails/insurancedetailsgrid/insurancedetailsgrid.component';
import { LoanassetsformComponent } from './loanassets/loanassetsform/loanassetsform.component';
import { LoanassetsgridComponent } from './loanassets/loanassetsgrid/loanassetsgrid.component';
import { MacrofileupdateComponent } from './macrofileupdate/macrofileupdate.component';
import { PrintlabelformComponent } from './printlabel/printlabelform/printlabelform.component';
import { QrcodeprintComponent } from './qrcodeprint/qrcodeprint.component';
import { ReceiptUploadComponent } from './receipt-upload/receipt-upload.component';
import { ReceiptmasterformComponent } from './receiptmaster/receiptmasterform/receiptmasterform.component';
import { ReceiptmastergridComponent } from './receiptmaster/receiptmastergrid/receiptmastergrid.component';
import { TransactionComponent } from './transaction.component';
import { TransferrequestverificationformComponent } from './transferrequestverification/transferrequestverificationform/transferrequestverificationform.component';
import { WarrantydetailsformComponent } from './warrantydetails/warrantydetailsform/warrantydetailsform.component';
import { WarrantydetailsgridComponent } from './warrantydetails/warrantydetailsgrid/warrantydetailsgrid.component';
import { SalesorderformComponent } from './salesorder/salesorderform/salesorderform.component';
import { SalesordergridComponent } from './salesorder/salesordergrid/salesordergrid.component';
import { PrintexistingstockComponent } from './printlabel/printexistingstock/printexistingstock.component';
import { PicklistgridComponent } from './picklist/picklistgrid/picklistgrid.component';
import { PicklistformComponent } from './picklist/picklistform/picklistform.component';
import { ReceiptdetailsComponent } from './receiptmaster/receiptdetails/receiptdetails.component';
import { ShipmentgridComponent } from './shipment/shipmentgrid/shipmentgrid.component';
import { ShipmentformComponent } from './shipment/shipmentform/shipmentform.component';
import { TransferordergridComponent } from './transferorder/transferordergrid/transferordergrid.component';
import { TransferorderformComponent } from './transferorder/transferorderform/transferorderform.component';
import { TransferrquestgridComponent } from './transferrequest/transferrquestgrid/transferrquestgrid.component';
import { TransferrquestformComponent } from './transferrequest/transferrquestform/transferrquestform.component';
import { InventorysummarygridComponent } from './Inventorysummary/inventorysummarygrid/inventorysummarygrid.component';
import { InventorydetailsgridComponent } from './inventorydetails/inventorydetailsgrid/inventorydetailsgrid.component';
import { ManaultoreceiptformComponent } from './manualtransferorderreceipt/manaultoreceiptform/manaultoreceiptform.component';
import { ProductionordergridComponent } from './productionorder/productionordergrid/productionordergrid.component';
import { ProductionorderformComponent } from './productionorder/productionorderform/productionorderform.component';
import { ProductionorderPrintlabelComponent } from './productionorder/productionorder-printlabel/productionorder-printlabel.component';
import { PurchaseordergridComponent } from './purchaseorder/purchaseordergrid/purchaseordergrid.component';
import { PurchaseorderformComponent } from './purchaseorder/purchaseorderform/purchaseorderform.component';
import { SalesreturngridComponent } from './salesreturn/salesreturngrid/salesreturngrid.component';
import { SalesreturnformComponent } from './salesreturn/salesreturnform/salesreturnform.component';
import { TransferreturngridComponent } from './transferreturn/transferreturngrid/transferreturngrid.component';
import { TransferreturnformComponent } from './transferreturn/transferreturnform/transferreturnform.component';


import { InboundComponent } from './inbound/inbound.component';
const routes: Routes = [{ path: '', component: TransactionComponent },
{ path: 'receiptupload', component: ReceiptUploadComponent, canActivate: [AuthGuard] },
{ path: 'receipt', component: ReceiptmastergridComponent, canActivate: [AuthGuard] },
{ path: 'receipt/:state/:id', component: ReceiptdetailsComponent, canActivate: [AuthGuard] },
// { path: 'receipt/add', component: ReceiptmasterformComponent, canActivate: [AuthGuard] },
// { path: 'receipt/details/:id', component: ReceiptdetailsComponent, canActivate: [AuthGuard] },
// { path: 'receipt/:state/:id', component: ReceiptmasterformComponent, canActivate: [AuthGuard] },

{ path: 'assetregister', component: AssetregistergridComponent, canActivate: [AuthGuard] },
{ path: 'assetregister/add', component: AssetregisterformComponent, canActivate: [AuthGuard] },
{ path: 'assetregister/:state/:id', component: AssetregisterformComponent, canActivate: [AuthGuard] },
{ path: 'assetregister/:state/:id', component: AssetregisterformComponent, outlet: "assetregisterpopup", canActivate: [AuthGuard] },
{ path: 'assetverification', component: AssetverificationformComponent, canActivate: [AuthGuard] },
{ path: 'assetverification/add', component: AssetverificationformComponent, canActivate: [AuthGuard] },
{ path: 'assetverification/:state/:id', component: AssetverificationformComponent, canActivate: [AuthGuard] },
{ path: 'warrantydetails', component: WarrantydetailsgridComponent, canActivate: [AuthGuard] },
{ path: 'warrantydetails/add', component: WarrantydetailsformComponent, canActivate: [AuthGuard] },
{ path: 'warrantydetails/:state/:id', component: WarrantydetailsformComponent, canActivate: [AuthGuard] },
{ path: 'insurancedetails', component: InsurancedetailsgridComponent, canActivate: [AuthGuard] },
{ path: 'insurancedetails/add', component: InsurancedetailsformComponent, canActivate: [AuthGuard] },
{ path: 'insurancedetails/:state/:id', component: InsurancedetailsformComponent, canActivate: [AuthGuard] },
{ path: 'additionalcostdetails', component: AdditionalcostdetailsgridComponent, canActivate: [AuthGuard] },
{ path: 'additionalcostdetails/add', component: AdditionalcostdetailsformComponent, canActivate: [AuthGuard] },
{ path: 'additionalcostdetails/:state/:id', component: AdditionalcostdetailsformComponent, canActivate: [AuthGuard] },
{ path: 'physicalcount', component: AssetauditgridComponent, canActivate: [AuthGuard] },
{ path: 'physicalcount/add', component: AssetauditformComponent, canActivate: [AuthGuard] },
{ path: 'physicalcount/assetsummary/:id', component: AssetsummaryComponent, canActivate: [AuthGuard] },
{ path: 'physicalcount/:state/:id', component: AssetauditformComponent, canActivate: [AuthGuard] },
{ path: 'auditverify', component: AuditverifyformComponent, canActivate: [AuthGuard] },
{ path: 'auditdiscrepancy', component: AuditdiscrepancyformComponent, canActivate: [AuthGuard] },

// { path: 'transfer', component: AssettransferdirectgridComponent, canActivate: [AuthGuard] },
// { path: 'transfer/add', component: AssettransferdirectformComponent, canActivate: [AuthGuard] },
// { path: 'transfer/:state/:id', component: AssettransferdirectformComponent, canActivate: [AuthGuard] },
// { path: 'transferrequest/verify/:id', component: AssettransferverificationComponent, canActivate: [AuthGuard] },
// { path: 'transferrequest', component: AssettransferrequestgridComponent, canActivate: [AuthGuard] },
// { path: 'transferrequest/add', component: AssettransferrequestformComponent, canActivate: [AuthGuard] },
// { path: 'transferrequest/:state/:id', component: AssettransferrequestformComponent, canActivate: [AuthGuard] },
{ path: 'transferrequestverification/:state/:id', component: TransferrequestverificationformComponent, canActivate: [AuthGuard] },


{ path: 'maintenance', component: AssetmaintenancegridComponent, canActivate: [AuthGuard] },
{ path: 'maintenance/add', component: AssetmaintenanceformComponent, canActivate: [AuthGuard] },
{ path: 'maintenance/:state/:id', component: AssetmaintenanceformComponent, canActivate: [AuthGuard] },
{ path: 'assetloan', component: LoanassetsgridComponent, canActivate: [AuthGuard] },
{ path: 'assetloan/add', component: LoanassetsformComponent, canActivate: [AuthGuard] },
{ path: 'assetloan/:state/:id', component: LoanassetsformComponent, canActivate: [AuthGuard] },
{ path: 'printlabel_1', component: PrintlabelformComponent, canActivate: [AuthGuard] },
{ path: 'printbydocument', component: DocumenttagprintComponent, canActivate: [AuthGuard] },
{ path: 'qrcodeprint', component: QrcodeprintComponent, canActivate: [AuthGuard] },
{ path: 'macrofileupdate', component: MacrofileupdateComponent, canActivate: [AuthGuard] },
{ path: 'assetfileupload', component: AssetfileuploadComponent, canActivate: [AuthGuard] },
{ path: 'assetdisposal', component: AssetdisposalformComponent, canActivate: [AuthGuard] },

{ path: 'inbound', component: InboundComponent, canActivate: [AuthGuard] },
{ path: 'salesorder', component: SalesordergridComponent, canActivate: [AuthGuard] },
{ path: 'salesorder/:state/:id', component: SalesorderformComponent, canActivate: [AuthGuard] },
{ path: 'salesreturn', component: SalesreturngridComponent, canActivate: [AuthGuard] },
{ path: 'salesreturn/:state/:id', component: SalesreturnformComponent, canActivate: [AuthGuard] },


{ path: 'printexistingstock', component: PrintexistingstockComponent, canActivate: [AuthGuard] },
{ path: 'picklist', component: PicklistgridComponent, canActivate: [AuthGuard] },
{ path: 'picklist/:state/:id', component: PicklistformComponent, canActivate: [AuthGuard] },
{ path: 'shipment', component: ShipmentgridComponent, canActivate: [AuthGuard] },
{ path: 'shipment/:state/:id', component: ShipmentformComponent, canActivate: [AuthGuard] },
{ path: 'transferorder', component: TransferordergridComponent, canActivate: [AuthGuard] },
{ path: 'transferorder/:state/:id', component: TransferorderformComponent, canActivate: [AuthGuard] },
{ path: 'transferreturn', component: TransferreturngridComponent, canActivate: [AuthGuard] },
{ path: 'transferreturn/:state/:id', component: TransferreturnformComponent, canActivate: [AuthGuard] },
{ path: 'transferrequest', component: TransferrquestgridComponent, canActivate: [AuthGuard] },
{ path: 'transferrequest/add', component: TransferrquestformComponent, canActivate: [AuthGuard] },
{ path: 'transferrequest/:state/:id', component: TransferrquestformComponent, canActivate: [AuthGuard] },
{ path: 'inventorysummary', component: InventorysummarygridComponent, canActivate: [AuthGuard] },
{ path: 'inventorydetails', component: InventorydetailsgridComponent, canActivate: [AuthGuard] },
{ path: 'manualtoreceipt', component: ManaultoreceiptformComponent, canActivate: [AuthGuard] },
{ path: 'productionorder', component: ProductionordergridComponent, canActivate: [AuthGuard] },
{ path: 'productionorder/:state/:id', component: ProductionorderformComponent, canActivate: [AuthGuard] },
{ path: 'printlabelproduction', component: ProductionorderPrintlabelComponent, canActivate: [AuthGuard] },

{ path: 'salesreturn', component: SalesordergridComponent, canActivate: [AuthGuard] },
{ path: 'transferreturn', component: TransferordergridComponent, canActivate: [AuthGuard] },
{ path: 'purchasereturn', component: PurchaseordergridComponent, canActivate: [AuthGuard] },
{ path: 'purchasereturn/view/:id', component: PurchaseorderformComponent, canActivate: [AuthGuard] },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransactionRoutingModule { }
