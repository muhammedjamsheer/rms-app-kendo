import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AgGridAngular } from 'ag-grid-angular';
import { AssetTransferRequestService } from '../../../../core/service/assettransferrequest.service';
import { SaveAlert } from '../../../../shared/commonalerts/savealert';
import { AssetTransferLineItemModel } from '../../../../shared/model/AssetTransferLineItemModel';
import { AssetTransferRequestModel } from '../../../../shared/model/AssetTransferRequestModel';
import { Observable } from 'rxjs';
import { Console } from 'console';
import Swal from "sweetalert2";
declare var $: any;

@Component({
  selector: 'org-fat-transferrequestverificationform',
  templateUrl: './transferrequestverificationform.component.html',
  styleUrls: ['./transferrequestverificationform.component.scss']
})
export class TransferrequestverificationformComponent implements OnInit {
  @ViewChild('agGrid') agGrid!: AgGridAngular;
  transferRequestVerificationForm: FormGroup;
  submitted = false;
  loading = false;
  isbtnSaveDisabled: boolean = false;
  isbtnClearDisabled: boolean = false;
  error = '';
  errorRequest = '';
  editMode: boolean = false;
  requestData!: AssetTransferRequestModel;
  assetTransferRequestModel: AssetTransferRequestModel = new AssetTransferRequestModel;
  rowRequestData!: AssetTransferLineItemModel[];
  columnRequestDefs: any;
  gridApi: any;
  gridColumnApi: any;
  requestNo: string = '';

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private assetTransferRequestService: AssetTransferRequestService,
    private saveAlert: SaveAlert) {

    this.transferRequestVerificationForm = this.formBuilder.group({
      VerifierRemarks: [null, Validators.required]
    });
  }

  async ngOnInit() {
    this.rowRequestData = [];
    this.columnRequestDefs = [
      // { field: 'assetCategoryId', sortable: true, filter: true, hide: true },
      // { headerName: 'Category Code',  field: 'assetCategoryCode', sortable: true, filter: true , width: 150},
      // { headerName: 'Category Name', field: 'assetCategoryName', sortable: true, filter: true , width: 150},
      // { field: 'assetSubCategoryId', sortable: true, filter: true, hide: true },
      // { headerName: 'Sub Category Code', field: 'assetSubCategoryCode', sortable: true, filter: true , width: 150},
      // { headerName: 'Sub Category Name', field: 'assetSubCategoryName', sortable: true, filter: true , width: 150},
      // { field: 'productId', sortable: true, filter: true, hide: true },
      // { headerName: 'Product Code', field: 'productCode', sortable: true, filter: true, width: 150 },
      // { headerName: 'Product Name', field: 'productName', sortable: true, filter: true, width: 150 },
      // { field: 'productDescription', sortable: true, filter: true, width: 200 },            
      // { field: 'quantity', sortable: true, filter: true, width: 120 }    
      { field: 'productId', sortable: true, filter: true },
      { field: 'productCode', sortable: true, filter: true, width: 300 },
      { field: 'productDescription', sortable: true, filter: true, width: 300 },
      { field: 'category', sortable: true, filter: true },
      { field: 'quantity', sortable: true, filter: true },
    ];

    this.route.params.subscribe(params => {
      if (params['id'] != undefined) {
        this.requestNo = params['id'];
        this.editMode = true;
        this.assetTransferRequestService.getAssetTransferRequestByKey(this.requestNo).subscribe(res => {
          this.requestData = res;
          this.ShowEditViewAssetVerification(this.requestData);
        });
        if (params['state'] === 'view') {
          this.disableControls();
        }
      } else {
        this.editMode = false;
      }
    });
  }

  get transferRequestVerificationFormControls() { return this.transferRequestVerificationForm.controls; }

  async ShowGrid(status: number) {
    var model: AssetTransferRequestModel = new AssetTransferRequestModel;
    this.assetTransferRequestService.getAssetTransferRequestByKey(this.requestNo).subscribe(res => {
      model = res;
      if (status != 0) {
        model.status = status;
        this.assetTransferRequestService.AddOrEditRecordToCache(model, true);
      }

      this.router.navigateByUrl('/transferrequest');
    });

  }

  disableControls() {
    this.isbtnClearDisabled = true;
  }

  ShowEditViewAssetVerification(data: AssetTransferRequestModel) {
    this.transferRequestVerificationFormControls.VerifierRemarks.setValue('');
    this.rowRequestData = data.requestLines;
    this.UpdateRequestSubGridRows();
    this.disableControls();
  }

  private UpdateRequestSubGridRows() {
    this.gridApi.setRowData(this.rowRequestData);
    this.gridApi.redrawRows();
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }
  ApproveTransferRequest(status: number) {
    this.submitted = true;
    if (this.transferRequestVerificationForm.invalid) {
      return;
    }
    this.error = '';
    Swal.fire({
      title: status == 50 ? 'Do you want to approve?' : 'Do you want to reject?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        let saveResponse: Observable<any>;
        saveResponse = this.assetTransferRequestService.ApproveRequest(this.requestNo, this.transferRequestVerificationFormControls.VerifierRemarks.value, status);
        saveResponse.subscribe(async result => {
          this.saveAlert.showMessage('success', status == 50 ? 'Approved successfully !' : 'Rejected successfully !');
          this.submitted = false;
          await this.ShowGrid(status);
        },
          err => {
            this.error = err.error ? err.error : err.message;
            this.loading = false;
          }
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
        )
      }
    })
  }
}