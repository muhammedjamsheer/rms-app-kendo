import { DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AgGridModule } from 'ag-grid-angular';
import { FileUploadModule } from 'ng2-file-upload';
import { TreeviewModule } from 'ngx-treeview';
import { ModalModule } from '../../core/_modal';
import { SharedModule } from '../../shared/shared.module';
import { MasterRoutingModule } from '../master/master-routing.module';
import { AdditionalcostdetailsformComponent } from './additionalcostdetails/additionalcostdetailsform/additionalcostdetailsform.component';
import { AdditionalcostdetailsgridComponent } from './additionalcostdetails/additionalcostdetailsgrid/additionalcostdetailsgrid.component';
import { AssetauditformComponent } from './assetaudit/assetauditform/assetauditform.component';
import { AssetauditgridComponent } from './assetaudit/assetauditgrid/assetauditgrid.component';
import { AssetdepreciationformComponent } from './assetdepreciation/assetdepreciationform/assetdepreciationform.component';
import { AssetdisposalformComponent } from './assetdisposal/assetdisposalform/assetdisposalform.component';
import { AssetdisposalgridComponent } from './assetdisposal/assetdisposalgrid/assetdisposalgrid.component';
import { AssetregisterformComponent } from './assetregister/assetregisterform/assetregisterform.component';
import { AssetregistergridComponent } from './assetregister/assetregistergrid/assetregistergrid.component';
import { AssettransferdirectformComponent } from './assettransferdirect/assettransferdirectform/assettransferdirectform.component';
import { AssettransferrequestformComponent } from './assettransferrequest/assettransferrequestform/assettransferrequestform.component';
import { AssettransferrequestgridComponent } from './assettransferrequest/assettransferrequestgrid/assettransferrequestgrid.component';
import { AssetverificationformComponent } from './assetverification/assetverificationform/assetverificationform.component';
import { AssetverificationgridComponent } from './assetverification/assetverificationgrid/assetverificationgrid.component';
import { AuditdiscrepancyformComponent } from './auditdiscrepancy/auditdiscrepancyform/auditdiscrepancyform.component';
import { AuditverifyformComponent } from './auditverify/auditverifyform/auditverifyform.component';
import { AuditverifygridComponent } from './auditverify/auditverifygrid/auditverifygrid.component';
import { InsurancedetailsformComponent } from './insurancedetails/insurancedetailsform/insurancedetailsform.component';
import { InsurancedetailsgridComponent } from './insurancedetails/insurancedetailsgrid/insurancedetailsgrid.component';
import { ReceiptmasterformComponent } from './receiptmaster/receiptmasterform/receiptmasterform.component';
import { ReceiptmastergridComponent } from './receiptmaster/receiptmastergrid/receiptmastergrid.component';
import { TransactionRoutingModule } from './transaction-routing.module';
import { TransactionComponent } from './transaction.component';
import { WarrantydetailsformComponent } from './warrantydetails/warrantydetailsform/warrantydetailsform.component';
import { WarrantydetailsgridComponent } from './warrantydetails/warrantydetailsgrid/warrantydetailsgrid.component';
import { TransferrequestverificationformComponent } from './transferrequestverification/transferrequestverificationform/transferrequestverificationform.component';
import { AssetmaintenanceformComponent } from './assetmaintenance/assetmaintenanceform/assetmaintenanceform.component';
import { AssetmaintenancegridComponent } from './assetmaintenance/assetmaintenancegrid/assetmaintenancegrid.component';
import { AssettransferdirectgridComponent } from './assettransferdirect/assettransferdirectgrid/assettransferdirectgrid.component';
import { LoanassetsformComponent } from './loanassets/loanassetsform/loanassetsform.component';
import { LoanassetsgridComponent } from './loanassets/loanassetsgrid/loanassetsgrid.component';
import { PrintlabelformComponent } from './printlabel/printlabelform/printlabelform.component';
import { AssetsummaryComponent } from './assetaudit/assetsummary/assetsummary.component';
import { AssettransferverificationComponent } from './assettransferdirect/assettransferverification/assettransferverification.component';
import { ReceiptUploadComponent } from './receipt-upload/receipt-upload.component';
import { DocumenttagprintComponent } from './documenttagprint/documenttagprint.component';
import { MacrofileupdateComponent } from './macrofileupdate/macrofileupdate.component';
import { AssetfileuploadComponent } from './assetfileupload/assetfileupload.component';
import { QrcodeprintComponent } from './qrcodeprint/qrcodeprint.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { InboundComponent } from './inbound/inbound.component';
import { InboundHeadComponent } from './inbound/inbound-head/inbound-head.component';
import { InboundDetailComponent } from './inbound/inbound-detail/inbound-detail.component';
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
import { PurchaseorderreturngridComponent } from './purchaseorderreturn/purchaseorderreturngrid/purchaseorderreturngrid.component';
import { PurchaseorderreturformComponent } from './purchaseorderreturn/purchaseorderreturform/purchaseorderreturform.component';




@NgModule({
  declarations: [TransactionComponent, ReceiptmasterformComponent, ReceiptmastergridComponent, AssetregisterformComponent, AssetregistergridComponent, AssetverificationformComponent, AssetverificationgridComponent, AssetdepreciationformComponent, AssetdisposalformComponent, AssetdisposalgridComponent, WarrantydetailsformComponent, WarrantydetailsgridComponent, InsurancedetailsformComponent, InsurancedetailsgridComponent, AdditionalcostdetailsformComponent, AdditionalcostdetailsgridComponent, AssetauditformComponent, AssetauditgridComponent, AuditverifyformComponent, AuditverifygridComponent, AuditdiscrepancyformComponent, AssettransferdirectformComponent, AssettransferrequestformComponent, AssettransferrequestgridComponent, TransferrequestverificationformComponent, AssetmaintenanceformComponent, AssetmaintenancegridComponent, AssettransferdirectgridComponent, LoanassetsformComponent, LoanassetsgridComponent
    , PrintlabelformComponent, AssetsummaryComponent
    , AssettransferverificationComponent, ReceiptUploadComponent
    , DocumenttagprintComponent, MacrofileupdateComponent
    , AssetfileuploadComponent, QrcodeprintComponent, InboundComponent
    , InboundHeadComponent, InboundDetailComponent, SalesorderformComponent, SalesordergridComponent, PrintexistingstockComponent, PicklistgridComponent, ReceiptdetailsComponent, ShipmentgridComponent, ShipmentformComponent, TransferordergridComponent, TransferorderformComponent, TransferrquestgridComponent, TransferrquestformComponent, InventorysummarygridComponent, InventorydetailsgridComponent, PicklistformComponent, ManaultoreceiptformComponent, ProductionordergridComponent, ProductionorderformComponent, ProductionorderPrintlabelComponent, PurchaseordergridComponent, PurchaseorderformComponent, SalesreturngridComponent, SalesreturnformComponent, TransferreturngridComponent, TransferreturnformComponent, PurchaseorderreturngridComponent, PurchaseorderreturformComponent],
  imports: [
    SharedModule,
    TransactionRoutingModule,
    SharedModule,
    BrowserModule,
    MasterRoutingModule,
    ReactiveFormsModule,
    FileUploadModule,
    ModalModule,
    AgGridModule.withComponents([]),
    TreeviewModule.forRoot(),
    NgSelectModule
  ],
  exports: [
    AssetregisterformComponent
  ],
  providers: [DatePipe]
})
export class TransactionModule { }
