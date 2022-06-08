import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AgGridAngular } from 'ag-grid-angular';
import { AssetAuditService } from '../../../../core/service/assetaudit.service';
import { ReceiptMasterService } from '../../../../core/service/receiptmaster.service';
import { SaveAlert } from '../../../../shared/commonalerts/savealert';
import { AssetAuditModel } from '../../../../shared/model/AssetAuditModel';
import { AssetAuditVerifyModel } from '../../../../shared/model/AssetAuditVerifyModel';
import { AssetVerificationModel } from '../../../../shared/model/AssetVerificationModel';
import { ReceiptMasterModel } from '../../../../shared/model/ReceiptMasterModel';
declare var $: any;

@Component({
  selector: 'org-fat-auditverifyform',
  templateUrl: './auditverifyform.component.html',
  styleUrls: ['./auditverifyform.component.scss']
})
export class AuditverifyformComponent implements OnInit {
  @ViewChild('agGrid') agGrid!: AgGridAngular;
  auditverifyform: FormGroup;
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
  rowAuditVerifyData: AssetAuditVerifyModel[] = [];
  assetAuditModel!: AssetAuditModel;
  columnReceiptDefs: any;
  gridApi: any;
  gridColumnApi: any;
  totalGridCount: number = 0;
  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private assetAuditService: AssetAuditService,
    private saveAlert: SaveAlert,
    private receiptMasterService: ReceiptMasterService, private datepipe: DatePipe) {

    this.auditverifyform = this.formBuilder.group({
      AuditNo: [null],
      AuditDate: [null],
      Remarks: [null]
    });
  }

  async ngOnInit() {
    this.route.queryParamMap.subscribe((params: any) => {
      this.auditverifyFormControls.AuditNo.setValue(params.params.auditNo);
      $("#AuditDate .datetimepicker-input").val(params.params.auditDate);
    });

    this.auditverifyFormControls.AuditNo.disable();
    this.assetAuditModel = await this.assetAuditService.getAssetAuditVerifyDetails(this.auditverifyFormControls.AuditNo.value);
    this.rowAuditVerifyData = this.assetAuditModel.serialNos;
    this.totalGridCount = this.rowAuditVerifyData.length;
    this.auditverifyFormControls.Remarks.setValue(this.assetAuditModel.remark);
    this.columnReceiptDefs = [
      { field: 'serialNo', sortable: true, filter: true },
      { field: 'productId', sortable: true, filter: true, hide: true },
      { field: 'productCode', sortable: true, filter: true },
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
  }

  get auditverifyFormControls() { return this.auditverifyform.controls; }


  ShowGrid() {
    this.router.navigateByUrl('/physicalcount');
  }

  disableControls() {
  }

  ClearContents() {

  }

  ShowEditViewAssetVerification(data: ReceiptMasterModel) {

  }

  OpenDiscrepancy() {
    this.router.navigate(["auditdiscrepancy"], { queryParams: { auditNo: this.auditverifyFormControls.AuditNo.value, auditDate: $("#AuditDate .datetimepicker-input").val() } });
  }
  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }



}