import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AgGridAngular } from 'ag-grid-angular';
import { AssetAuditService } from '../../../../core/service/assetaudit.service';
import { ModalService } from '../../../../..../../core/_modal';
import { ROUND_ANTICLOCK_ANIMATION } from '../../../../shared/animations/round-anticlock.animation';
import { SaveAlert } from '../../../../shared/commonalerts/savealert';
import { AssetAuditVerifyModel } from '../../../../shared/model/AssetAuditVerifyModel';
import { AssetVerificationModel } from '../../../../shared/model/AssetVerificationModel';
import { ReceiptMasterModel } from '../../../../shared/model/ReceiptMasterModel';
declare var $: any;

@Component({
  selector: 'org-fat-auditdiscrepancyform',
  templateUrl: './auditdiscrepancyform.component.html',
  styleUrls: ['./auditdiscrepancyform.component.scss'],
  styles: [],
  animations: [
    ROUND_ANTICLOCK_ANIMATION
  ]
})
export class AuditdiscrepancyformComponent implements OnInit {
  @ViewChild('agGridLocation') agGridLocation!: AgGridAngular;
  @ViewChild('agGridNew') agGridNew!: AgGridAngular;

  auditdiscrepancyform: FormGroup;
  submitted = false;
  loading = false;
  isbtnSaveDisabled: boolean = false;
  isbtnClearDisabled: boolean = false;
  receiptId!: string;
  error = '';
  errorReceipt = '';
  editMode: boolean = false;
  receiptData!: ReceiptMasterModel;
  assetverificationmodel: AssetVerificationModel = new AssetVerificationModel;
  rowAuditLocationDiscrepancyData!: AssetAuditVerifyModel[];
  rowAuditMissingData!: AssetAuditVerifyModel[];
  rowAuditNewData!: AssetAuditVerifyModel[];
  columnReceiptDefs: any;
  gridApi: any;
  gridColumnApi: any;
  auditId!: number;
  auditDate!: Date;
  locationRowClicked: boolean = false;
  isNewAssetsRowClicked: boolean = false;
  locationDiscrepancyCount!: number;
  missingAssetsCount!: number;
  newAssetsCount!: number;

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private saveAlert: SaveAlert,
    private modalService: ModalService,
    private assetAuditService: AssetAuditService) {

    this.auditdiscrepancyform = this.formBuilder.group({
      AuditNo: [null],
      AuditDate: [null]
    });
  }

  async ngOnInit() {
    this.columnReceiptDefs = [
      { field: 'serialNo', sortable: true, filter: true,
      headerCheckboxSelection: true,
      headerCheckboxSelectionFilteredOnly: true,
      checkboxSelection: true
    },
      { field: 'productId', sortable: true, filter: true, hide: true },
      { field: 'productName', sortable: true, filter: true },
      { field: 'locationId', sortable: true, filter: true, hide: true },
      { field: 'locationCode', sortable: true, filter: true },
      { field: 'locationName', sortable: true, filter: true },
      { field: 'scanLocationCode', sortable: true, filter: true },
      { field: 'scanLocationName', sortable: true, filter: true },
      { field: 'status', sortable: true, filter: true, hide: true },
      { field: 'statusText', sortable: true, filter: true },
      { headerName: 'Category Name', field: 'assetCategoryName', sortable: true, filter: true },
      { headerName: 'Scan Remark', field: 'auditScanItemRemark', sortable: true, filter: true }

    ];

    this.route.queryParamMap.subscribe((params: any) => {
      this.auditId = params.params.auditNo;
      this.auditDate = params.params.auditDate;

    });

    this.rowAuditLocationDiscrepancyData = await this.assetAuditService.getAuditVerifyDetailsByStatus(this.auditId, 3);
    this.rowAuditMissingData = await this.assetAuditService.getAuditVerifyDetailsByStatus(this.auditId, 0);
    this.rowAuditNewData = await this.assetAuditService.getAuditVerifyDetailsByStatus(this.auditId, 2);
    this.locationDiscrepancyCount = this.rowAuditLocationDiscrepancyData.length;
    this.missingAssetsCount = this.rowAuditMissingData.length;
    this.newAssetsCount = this.rowAuditNewData.length;
  }

  get auditdiscrepancyFormControls() { return this.auditdiscrepancyform.controls; }


  ShowGrid() {
    this.router.navigate(['auditverify'], { queryParams: { auditNo: this.auditId, auditDate: this.auditDate } });
  }

  disableControls() {

  }

  ClearContents() {

  }

  ShowEditViewAssetVerification(data: ReceiptMasterModel) {
  }

  onDataGridSelectionChanged(event: any) {
    this.locationRowClicked = !this.locationRowClicked
  }

  ReScan() {
    var saveResponse = this.assetAuditService.Rescan(this.auditId);
    saveResponse.subscribe(
      result => {
        this.saveAlert.SuccessMessage();
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate(['./'], { queryParams: { auditNo: this.auditId, auditDate: this.auditDate }, relativeTo: this.route });
      },
      err => {
        this.error = err.error ? err.error : err.message;
        this.loading = false;
      }
    );
  }

  AcceptLocationChange() {
    var selectedSerialNos = this.agGridLocation.api.getSelectedRows().map(item => { return item.serialNo }).join(",");
    var array = selectedSerialNos.split(',');
    var saveResponse = this.assetAuditService.acceptLocationChange(this.auditId, array);

    saveResponse.subscribe(
      result => {
        this.saveAlert.SuccessMessage();
      },
      err => {
        this.error = err.error ? err.error : err.message;
        this.loading = false;
      }
    );
  }

  onLocationRowClick(event: any) {
    // this.locationRowClicked = true;
  }

  onNewAssetsRowClick(event: any) {
    this.isNewAssetsRowClicked = true;
  }

  openModal(id: string) {
    var assetRegisterSerialNo = this.agGridNew.api.getSelectedRows()[0].serialNo;
    this.router.navigate([{ outlets: { assetregisterpopup: ['assetregister', 'add', assetRegisterSerialNo] } }], { queryParams: { popup: 1, auditNo: this.auditId, auditDate: this.auditDate } });
    //this.modalService.open(id);
  }

  closeModal(id: string) {
    this.modalService.close(id);
  }

}